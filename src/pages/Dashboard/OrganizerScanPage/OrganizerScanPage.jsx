import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Calendar, MapPin, QrCode, ScanLine, Ticket } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { usePlatform } from '../../../context/PlatformContext';
import { useToast } from '../../../components/ui/overlays/Toast';

const OrganizerScanPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { success, error, info } = useToast();
  const { getOrganizerEvents, verifyTicketByCode } = usePlatform();

  const organizerEvents = useMemo(() => getOrganizerEvents(user), [getOrganizerEvents, user]);

  const initialEventId = new URLSearchParams(location.search).get('eventId') || '';
  const [selectedEventId, setSelectedEventId] = useState(initialEventId);
  const [qrCodeInput, setQrCodeInput] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const detectorRef = useRef(null);
  const scanIntervalRef = useRef(null);

  const selectedEvent = organizerEvents.find((event) => event.id === selectedEventId) || null;

  useEffect(() => {
    return () => {
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const handleTicketVerification = (ticketCode) => {
    if (!selectedEventId) {
      error('Sélectionne d’abord un événement.');
      return;
    }

    const result = verifyTicketByCode(ticketCode || qrCodeInput, user.id, selectedEventId);
    setScanResult(result);

    if (result.ok) {
      success(result.message);
      setQrCodeInput('');
    } else {
      error(result.message);
    }
  };

  const stopCamera = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setIsCameraActive(false);
  };

  const startCameraScan = async () => {
    if (!selectedEventId) {
      error('Sélectionne un événement avant de scanner.');
      return;
    }

    if (!('BarcodeDetector' in window)) {
      info('Scanner caméra non supporté ici. Utilise le code manuel.');
      return;
    }

    try {
      if (!detectorRef.current) {
        detectorRef.current = new window.BarcodeDetector({ formats: ['qr_code'] });
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      streamRef.current = stream;
      setIsCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      scanIntervalRef.current = setInterval(async () => {
        if (!videoRef.current || !detectorRef.current) return;

        try {
          const codes = await detectorRef.current.detect(videoRef.current);

          if (codes.length > 0 && codes[0].rawValue) {
            const value = codes[0].rawValue;
            setQrCodeInput(value);
            stopCamera();
            handleTicketVerification(value);
          }
        } catch (_error) {
          // Ignore transient detection errors
        }
      }, 600);
    } catch (_error) {
      error('Impossible d’accéder à la caméra.');
      stopCamera();
    }
  };

  return (
    <section className="min-h-[calc(100vh-5rem)] px-4 py-10 md:py-14 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="container mx-auto space-y-8">
        <div className="space-y-3">
          <p className="premium-badge">Dashboard Organisateur</p>
          <h1 className="text-3xl md:text-5xl font-black text-dark italic uppercase tracking-tight">Scanner tickets</h1>
          <p className="text-gray-600">Choisis un événement puis scanne les tickets pour valider les entrées.</p>
        </div>

        <article className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <label className="block text-sm font-bold text-gray-700">Événement à scanner</label>
          <select
            className="premium-input"
            value={selectedEventId}
            onChange={(event) => {
              setSelectedEventId(event.target.value);
              setScanResult(null);
            }}
          >
            <option value="">Sélectionner un événement</option>
            {organizerEvents.map((event) => (
              <option key={event.id} value={event.id}>{event.title}</option>
            ))}
          </select>

          {selectedEvent ? (
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="font-black text-dark">{selectedEvent.title}</p>
              <p className="text-sm text-gray-600 flex items-center gap-2 mt-1"><Calendar className="w-4 h-4" />{new Date(selectedEvent.date).toLocaleString('fr-FR')}</p>
              <p className="text-sm text-gray-600 flex items-center gap-2 mt-1"><MapPin className="w-4 h-4" />{selectedEvent.location}</p>
            </div>
          ) : null}

          <div className="flex gap-3">
            <input
              className="premium-input"
              placeholder="Code ticket (ex: EVF-XXXXXX-ABC123)"
              value={qrCodeInput}
              onChange={(event) => setQrCodeInput(event.target.value)}
            />
            <button type="button" className="btn-premium px-5" onClick={() => handleTicketVerification()}>
              Vérifier
            </button>
          </div>

          {!isCameraActive ? (
            <button type="button" className="w-full border border-gray-200 rounded-2xl px-4 py-3 font-bold text-sm hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2" onClick={startCameraScan}>
              <ScanLine className="w-4 h-4" /> Démarrer le scan caméra
            </button>
          ) : (
            <button type="button" className="w-full border border-gray-200 rounded-2xl px-4 py-3 font-bold text-sm hover:border-primary hover:text-primary transition-all" onClick={stopCamera}>
              Arrêter la caméra
            </button>
          )}

          {isCameraActive ? (
            <video ref={videoRef} className="w-full aspect-video rounded-2xl bg-black" muted playsInline />
          ) : null}

          {scanResult ? (
            <div className={`rounded-2xl px-4 py-3 text-sm font-semibold ${scanResult.ok ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {scanResult.message}
              {scanResult.ticket ? (
                <div className="mt-2 space-y-1 text-xs opacity-90">
                  <p className="inline-flex items-center gap-1"><Ticket className="w-3 h-3" />{scanResult.ticket.ticketTypeName} - {scanResult.ticket.price.toLocaleString()} FCFA</p>
                  <p>Participant: {scanResult.ticket.buyerName} ({scanResult.ticket.buyerEmail})</p>
                  <p>Code: <span className="font-mono">{scanResult.ticket.code}</span></p>
                </div>
              ) : null}
            </div>
          ) : null}

          <p className="text-xs text-gray-500">Le ticket est validé uniquement s’il appartient à l’événement sélectionné.</p>
        </article>
      </div>
    </section>
  );
};

export default OrganizerScanPage;
