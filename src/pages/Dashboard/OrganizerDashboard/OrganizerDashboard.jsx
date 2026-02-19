import React, { useMemo, useState } from 'react';
import { PlusCircle, QrCode, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { usePlatform } from '../../../context/PlatformContext';
import { useToast } from '../../../components/ui/overlays/Toast';

const initialForm = {
  title: '',
  description: '',
  category: 'festival',
  date: '',
  location: '',
  image: ''
};

const initialTicketDraft = {
  name: 'Standard',
  price: '',
  quantity: 200,
  benefits: 'Accès général'
};

const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error, info } = useToast();
  const {
    createOrganizerEvent,
    getOrganizerEvents,
    getOrganizerTickets
  } = usePlatform();

  const [formData, setFormData] = useState(initialForm);
  const [ticketDraft, setTicketDraft] = useState(initialTicketDraft);
  const [ticketTypes, setTicketTypes] = useState([]);

  const organizerEvents = useMemo(() => getOrganizerEvents(user), [getOrganizerEvents, user]);
  const organizerTickets = useMemo(() => getOrganizerTickets(user), [getOrganizerTickets, user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTicketDraftChange = (event) => {
    const { name, value } = event.target;
    setTicketDraft((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTicketType = () => {
    if (!ticketDraft.name.trim() || Number(ticketDraft.price) < 0 || Number(ticketDraft.quantity) < 1) {
      error('Renseigne correctement le type, le prix et la quantité du ticket.');
      return;
    }

    const newType = {
      id: `draft-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      name: ticketDraft.name.trim(),
      price: Number(ticketDraft.price),
      quantity: Number(ticketDraft.quantity),
      benefits: ticketDraft.benefits
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    };

    setTicketTypes((prev) => [...prev, newType]);
    setTicketDraft(initialTicketDraft);
    success('Type de ticket ajouté.');
  };

  const handleRemoveTicketType = (ticketTypeId) => {
    setTicketTypes((prev) => prev.filter((ticketType) => ticketType.id !== ticketTypeId));
  };

  const handleCreateEvent = (event) => {
    event.preventDefault();

    if (!formData.title || !formData.description || !formData.date || !formData.location) {
      error('Complète les champs requis pour publier ton événement.');
      return;
    }

    if (ticketTypes.length === 0) {
      error('Ajoute au moins un type de ticket avant de publier.');
      return;
    }

    createOrganizerEvent({ ...formData, ticketTypes }, user);
    success('Événement publié avec succès.');
    setFormData(initialForm);
    setTicketDraft(initialTicketDraft);
    setTicketTypes([]);
    navigate('/dashboard/organizer/events');
  };

  return (
    <section className="min-h-[calc(100vh-5rem)] px-4 py-10 md:py-14 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="container mx-auto space-y-8">
        <div className="space-y-3">
          <p className="premium-badge bg-red-600 text-white border-transparent">Dashboard Organisateur</p>
          <h1 className="text-3xl md:text-5xl font-black text-dark italic uppercase tracking-tight">Pilote tes événements</h1>
          <p className="text-gray-600">Crée des tickets, publie tes events et valide les QR à l’entrée.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-3xl bg-white border border-gray-200 p-5 shadow-sm">
            <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">Événements publiés</p>
            <p className="text-3xl font-black text-dark mt-2">{organizerEvents.length}</p>
          </div>
          <div className="rounded-3xl bg-white border border-gray-200 p-5 shadow-sm">
            <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">Tickets vendus</p>
            <p className="text-3xl font-black text-dark mt-2">{organizerTickets.length}</p>
          </div>
          <div className="rounded-3xl bg-white border border-gray-200 p-5 shadow-sm">
            <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">Tickets scannés</p>
            <p className="text-3xl font-black text-primary mt-2">{organizerTickets.filter((ticket) => ticket.status === 'USED').length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <article className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-dark uppercase italic mb-5 flex items-center gap-2"><PlusCircle className="w-5 h-5 text-primary" />Créer un événement</h2>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <input className="premium-input" name="title" placeholder="Titre de l’événement" value={formData.title} onChange={handleChange} />
              <textarea className="premium-input min-h-24" name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <select className="premium-input" name="category" value={formData.category} onChange={handleChange}>
                  <option value="festival">Festival</option>
                  <option value="concert">Concert</option>
                  <option value="conference">Conférence</option>
                  <option value="culture">Culture</option>
                  <option value="sport">Sport</option>
                </select>
                <input className="premium-input" name="date" type="datetime-local" value={formData.date} onChange={handleChange} />
              </div>
              <input className="premium-input" name="location" placeholder="Lieu" value={formData.location} onChange={handleChange} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input className="premium-input" name="image" placeholder="URL image (optionnel)" value={formData.image} onChange={handleChange} />
                  <input
                    className="premium-input"
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          setFormData(prev => ({ ...prev, image: ev.target.result }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 space-y-3">
                <p className="text-xs font-black uppercase tracking-widest text-gray-500">Ajouter un type de ticket</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input className="premium-input" name="name" placeholder="Nom ticket" value={ticketDraft.name} onChange={handleTicketDraftChange} />
                  <input className="premium-input" name="price" type="number" min="0" placeholder="Prix FCFA" value={ticketDraft.price} onChange={handleTicketDraftChange} />
                  <input className="premium-input" name="quantity" type="number" min="1" placeholder="Quantité" value={ticketDraft.quantity} onChange={handleTicketDraftChange} />
                </div>
                <input className="premium-input" name="benefits" placeholder="Bénéfices (séparés par des virgules)" value={ticketDraft.benefits} onChange={handleTicketDraftChange} />
                <button type="button" onClick={handleAddTicketType} className="w-full border border-primary text-primary rounded-2xl py-3 font-bold text-sm hover:bg-primary hover:text-white transition-colors">
                  Ajouter un type de ticket
                </button>

                {ticketTypes.length > 0 ? (
                  <div className="space-y-2">
                    {ticketTypes.map((ticketType, idx) => (
                      <div key={ticketType.id} className="flex items-center justify-between gap-3 bg-white border border-gray-100 rounded-xl p-3">
                        <div>
                          <p className="font-black text-dark text-sm">{ticketType.name}</p>
                          <p className="text-xs text-gray-500">{ticketType.price.toLocaleString()} FCFA • {ticketType.quantity} places</p>
                        </div>
                        <div className="flex flex-col gap-1 items-end">
                          <button
                            type="button"
                            onClick={() => {
                              if (idx > 0) {
                                setTicketTypes(prev => {
                                  const arr = [...prev];
                                  [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
                                  return arr;
                                });
                              }
                            }}
                            className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                            disabled={idx === 0}
                          >↑</button>
                          <button
                            type="button"
                            onClick={() => {
                              if (idx < ticketTypes.length - 1) {
                                setTicketTypes(prev => {
                                  const arr = [...prev];
                                  [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]];
                                  return arr;
                                });
                              }
                            }}
                            className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                            disabled={idx === ticketTypes.length - 1}
                          >↓</button>
                          <button
                            type="button"
                            onClick={() => handleRemoveTicketType(ticketType.id)}
                            className="text-xs font-bold uppercase tracking-wider text-red-600 hover:text-red-700"
                          >
                            Retirer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
              <button type="submit" className="btn-premium w-full justify-center">Publier l’événement</button>
            </form>

            <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs font-black uppercase tracking-widest text-gray-500">Aperçu visuel</p>
              <img
                src={formData.image || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=900&h=380&fit=crop'}
                alt="Aperçu événement"
                className="mt-3 w-full h-40 object-cover rounded-2xl"
              />
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="font-semibold text-gray-700">{formData.title || 'Titre événement'}</span>
                <span className="font-black text-primary">{ticketTypes.length > 0 ? `${Math.min(...ticketTypes.map((ticketType) => ticketType.price)).toLocaleString()} FCFA` : 'Prix'}</span>
              </div>
            </div>
          </article>

          <article className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-xl font-black text-dark uppercase italic flex items-center gap-2"><QrCode className="w-5 h-5 text-primary" />Scanner un ticket</h2>
            <p className="text-sm text-gray-600">Utilise la page dédiée pour scanner en fonction de l’événement et valider les infos du ticket.</p>
            <button
              type="button"
              onClick={() => navigate('/dashboard/organizer/scan')}
              className="btn-premium w-full justify-center"
            >
              Ouvrir la page de scan
            </button>
          </article>
        </div>

        <article className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-dark uppercase italic mb-5 flex items-center gap-2"><Ticket className="w-5 h-5 text-primary" />Derniers tickets vendus</h2>
          {organizerTickets.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-gray-600">
              Aucun ticket vendu pour le moment.
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Consulte les ventes regroupées par événement et clique pour afficher toutes les informations.</p>
              <button
                type="button"
                onClick={() => navigate('/dashboard/organizer/sales')}
                className="btn-premium w-full justify-center"
              >
                Ouvrir la page des ventes
              </button>
            </div>
          )}
        </article>
      </div>
    </section>
  );
};

export default OrganizerDashboard;
