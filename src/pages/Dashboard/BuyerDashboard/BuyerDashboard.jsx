import React, { useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, MapPin, Ticket, CheckCircle2, Clock4 } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { usePlatform } from '../../../context/PlatformContext';
import { Link } from 'react-router-dom';

const BuyerDashboard = () => {
  const { user } = useAuth();
  const { getBuyerTickets } = usePlatform();
  const [statusFilter, setStatusFilter] = useState('ALL');

  const tickets = getBuyerTickets(user);
  const filteredTickets = useMemo(() => {
    if (statusFilter === 'ALL') return tickets;
    return tickets.filter((ticket) => ticket.status === statusFilter);
  }, [tickets, statusFilter]);

  const getStatusPill = (ticket) => {
    if (ticket.status === 'ACTIVE') {
      return <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-green-100 text-green-700">Actif</span>;
    }
    return <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary">Utilisé</span>;
  };

  return (
    <section className="min-h-[calc(100vh-5rem)] px-4 py-10 md:py-14 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="container mx-auto space-y-8">
        <div className="space-y-3">
          <p className="premium-badge">Dashboard Acheteur</p>
          <h1 className="text-3xl md:text-5xl font-black text-dark italic uppercase tracking-tight">Mes Tickets</h1>
          <p className="text-gray-600">Retrouvez vos billets QR et leur statut en temps réel.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-3xl bg-white border border-gray-200 p-5 shadow-sm">
            <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">Total billets</p>
            <p className="text-3xl font-black text-dark mt-2">{tickets.length}</p>
          </div>
          <div className="rounded-3xl bg-white border border-gray-200 p-5 shadow-sm">
            <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">Actifs</p>
            <p className="text-3xl font-black text-green-600 mt-2">{tickets.filter((ticket) => ticket.status === 'ACTIVE').length}</p>
          </div>
          <div className="rounded-3xl bg-white border border-gray-200 p-5 shadow-sm">
            <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">Utilisés</p>
            <p className="text-3xl font-black text-primary mt-2">{tickets.filter((ticket) => ticket.status === 'USED').length}</p>
          </div>
        </div>

        {tickets.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <img
              src="https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=900&h=350&fit=crop"
              alt="Exemple de billet événement"
              className="w-full max-w-2xl h-40 object-cover rounded-2xl mx-auto mb-6"
            />
            <Ticket className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 font-semibold">Aucun ticket pour le moment.</p>
            <p className="text-sm text-gray-500 mt-1">Ajoute des billets au panier puis finalise l’achat pour les voir ici.</p>
            <Link to="/events" className="inline-flex mt-6 px-6 py-3 rounded-2xl bg-primary text-white font-bold text-sm hover:bg-primary-700 transition-colors">
              Explorer les événements
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-3">
              {['ALL', 'ACTIVE', 'USED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${statusFilter === status ? 'bg-primary text-white border-primary' : 'bg-white border-gray-200 text-gray-600 hover:border-primary hover:text-primary'}`}
                >
                  {status === 'ALL' ? 'Tous' : status === 'ACTIVE' ? 'Actifs' : 'Utilisés'}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTickets.map((ticket) => (
              <article key={ticket.id} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">{ticket.ticketTypeName}</p>
                    <h3 className="text-xl font-black text-dark mt-1">{ticket.eventTitle}</h3>
                  </div>
                  {getStatusPill(ticket)}
                </div>

                <img
                  src={ticket.eventImage || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=900&h=380&fit=crop'}
                  alt={ticket.eventTitle}
                  className="mt-4 w-full h-36 object-cover rounded-2xl border border-gray-100"
                />

                <div className="mt-5 grid grid-cols-[auto_1fr] gap-5 items-center">
                  <div className="p-2 rounded-2xl bg-white border border-gray-100">
                    <QRCodeSVG value={ticket.code} size={110} includeMargin />
                  </div>
                  <div className="space-y-2">
                    <p className="font-mono text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 break-all">{ticket.code}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-2"><Calendar className="w-4 h-4" />{new Date(ticket.eventDate).toLocaleString('fr-FR')}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-2"><MapPin className="w-4 h-4" />{ticket.eventLocation}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-2"><Clock4 className="w-4 h-4" />Émis le {new Date(ticket.issuedAt).toLocaleString('fr-FR')}</p>
                    {ticket.usedAt ? (
                      <p className="text-sm text-primary font-semibold flex items-center gap-2"><CheckCircle2 className="w-4 h-4" />Scanné le {new Date(ticket.usedAt).toLocaleString('fr-FR')}</p>
                    ) : null}
                  </div>
                </div>
              </article>
              ))}
            </div>

            {filteredTickets.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm text-gray-600">
                Aucun ticket dans ce filtre.
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
};

export default BuyerDashboard;
