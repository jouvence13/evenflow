import React, { useMemo, useState } from 'react';
import { Calendar, Edit3, Lock, MapPin, QrCode, Save, Ticket, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { usePlatform } from '../../../context/PlatformContext';
import { useToast } from '../../../components/ui/overlays/Toast';

const initialTicketDraft = {
  name: 'Standard',
  price: '',
  quantity: 100,
  benefits: 'Accès à l’événement'
};

const OrganizerEventsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getOrganizerEvents, updateOrganizerEvent } = usePlatform();
  const { success, error, info } = useToast();

  const organizerEvents = useMemo(() => getOrganizerEvents(user), [getOrganizerEvents, user]);

  const [editingEventId, setEditingEventId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    shortDescription: '',
    description: '',
    category: 'festival',
    date: '',
    endDate: '',
    location: '',
    city: '',
    address: '',
    image: '',
    tags: '',
    status: 'active'
  });
  const [editTicketTypes, setEditTicketTypes] = useState([]);
  const [ticketDraft, setTicketDraft] = useState(initialTicketDraft);

  const canEditEvent = (event) => new Date(event.date) > new Date();

  const startEditing = (event) => {
    if (!canEditEvent(event)) {
      info('Cet événement ne peut plus être modifié car il a déjà commencé.');
      return;
    }

    setEditingEventId(event.id);
    setEditForm({
      title: event.title || '',
      shortDescription: event.shortDescription || '',
      description: event.description || '',
      category: event.category || 'festival',
      date: event.date ? new Date(event.date).toISOString().slice(0, 16) : '',
      endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : '',
      location: event.location || '',
      city: event.city || '',
      address: event.address || '',
      image: event.images?.main || event.image || '',
      tags: Array.isArray(event.tags) ? event.tags.join(', ') : '',
      status: event.status || 'active'
    });
    setEditTicketTypes(
      (event.tickets?.types || []).map((ticketType) => ({
        id: ticketType.id,
        name: ticketType.name,
        price: ticketType.price,
        quantity: ticketType.quantity,
        sold: ticketType.sold || 0,
        benefits: Array.isArray(ticketType.benefits) ? ticketType.benefits.join(', ') : ''
      }))
    );
    setTicketDraft(initialTicketDraft);
  };

  const cancelEditing = () => {
    setEditingEventId(null);
    setEditForm({
      title: '',
      shortDescription: '',
      description: '',
      category: 'festival',
      date: '',
      endDate: '',
      location: '',
      city: '',
      address: '',
      image: '',
      tags: '',
      status: 'active'
    });
    setEditTicketTypes([]);
    setTicketDraft(initialTicketDraft);
  };

  const handleChange = (targetEvent) => {
    const { name, value } = targetEvent.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTicketTypeChange = (ticketTypeId, field, value) => {
    setEditTicketTypes((prev) => prev.map((ticketType) => {
      if (ticketType.id !== ticketTypeId) return ticketType;
      return { ...ticketType, [field]: value };
    }));
  };

  const removeTicketType = (ticketTypeId) => {
    setEditTicketTypes((prev) => prev.filter((ticketType) => ticketType.id !== ticketTypeId));
  };

  const handleTicketDraftChange = (targetEvent) => {
    const { name, value } = targetEvent.target;
    setTicketDraft((prev) => ({ ...prev, [name]: value }));
  };

  const addTicketType = () => {
    if (!ticketDraft.name.trim() || Number(ticketDraft.quantity) < 1 || Number(ticketDraft.price) < 0) {
      error('Type ticket invalide. Vérifie nom, prix et quantité.');
      return;
    }

    setEditTicketTypes((prev) => [
      ...prev,
      {
        id: `edited-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        name: ticketDraft.name.trim(),
        price: Number(ticketDraft.price),
        quantity: Number(ticketDraft.quantity),
        sold: 0,
        benefits: ticketDraft.benefits
      }
    ]);
    setTicketDraft(initialTicketDraft);
  };

  const handleSave = (eventId) => {
    if (!editForm.title || !editForm.description || !editForm.date || !editForm.location || !editForm.city || !editForm.address) {
      error('Complète les champs requis avant sauvegarde.');
      return;
    }

    if (editTicketTypes.length === 0) {
      error('Ajoute au moins un type de ticket.');
      return;
    }

    const payload = {
      ...editForm,
      tags: editForm.tags,
      ticketTypes: editTicketTypes.map((ticketType) => ({
        id: ticketType.id,
        name: ticketType.name,
        price: Number(ticketType.price),
        quantity: Number(ticketType.quantity),
        sold: Number(ticketType.sold || 0),
        benefits: String(ticketType.benefits || '').split(',').map((item) => item.trim()).filter(Boolean)
      }))
    };

    const result = updateOrganizerEvent(eventId, payload, user);
    if (!result.ok) {
      error(result.message);
      return;
    }

    success(result.message);
    cancelEditing();
  };

  return (
    <section className="min-h-[calc(100vh-5rem)] px-4 py-10 md:py-14 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="container mx-auto space-y-8">
        <div className="space-y-3">
          <p className="premium-badge">Dashboard Organisateur</p>
          <h1 className="text-3xl md:text-5xl font-black text-dark italic uppercase tracking-tight">Mes événements</h1>
          <p className="text-gray-600">Tu peux modifier un événement jusqu’à sa date de début.</p>
        </div>

        {organizerEvents.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <p className="text-gray-600 font-semibold">Aucun événement pour le moment.</p>
            <p className="text-sm text-gray-500 mt-1">Crée un événement depuis le dashboard organisateur.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {organizerEvents.map((event) => {
              const isEditing = editingEventId === event.id;
              const editable = canEditEvent(event);

              return (
                <article key={event.id} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                  {!isEditing ? (
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={event.images?.main || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=900&h=380&fit=crop'}
                            alt={event.title}
                            className="w-24 h-20 object-cover rounded-xl"
                          />
                          <div>
                            <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">{event.category}</p>
                            <h3 className="text-xl font-black text-dark">{event.title}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => navigate(`/dashboard/organizer/scan?eventId=${event.id}`)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-primary text-primary font-bold text-sm hover:bg-primary hover:text-white transition-colors"
                          >
                            <QrCode className="w-4 h-4" /> Scanner tickets
                          </button>

                          {editable ? (
                            <button
                              type="button"
                              onClick={() => startEditing(event)}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-primary text-primary font-bold text-sm hover:bg-primary hover:text-white transition-colors"
                            >
                              <Edit3 className="w-4 h-4" /> Modifier
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-500 font-bold text-sm">
                              <Lock className="w-4 h-4" /> Verrouillé (déjà commencé)
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                        <p className="flex items-center gap-2"><Calendar className="w-4 h-4" />{new Date(event.date).toLocaleString('fr-FR')}</p>
                        <p className="flex items-center gap-2"><MapPin className="w-4 h-4" />{event.location}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <input className="premium-input" name="title" value={editForm.title} onChange={handleChange} placeholder="Titre" />
                      <input className="premium-input" name="shortDescription" value={editForm.shortDescription} onChange={handleChange} placeholder="Sous-titre court" />
                      <textarea className="premium-input min-h-24" name="description" value={editForm.description} onChange={handleChange} placeholder="Description" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <select className="premium-input" name="category" value={editForm.category} onChange={handleChange}>
                          <option value="festival">Festival</option>
                          <option value="concert">Concert</option>
                          <option value="conference">Conférence</option>
                          <option value="culture">Culture</option>
                          <option value="sport">Sport</option>
                        </select>
                        <input className="premium-input" name="date" type="datetime-local" value={editForm.date} onChange={handleChange} />
                      </div>
                      <input className="premium-input" name="endDate" type="datetime-local" value={editForm.endDate} onChange={handleChange} />
                      <input className="premium-input" name="location" value={editForm.location} onChange={handleChange} placeholder="Lieu" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input className="premium-input" name="city" value={editForm.city} onChange={handleChange} placeholder="Ville" />
                        <input className="premium-input" name="address" value={editForm.address} onChange={handleChange} placeholder="Adresse" />
                      </div>
                      <input className="premium-input" name="image" value={editForm.image} onChange={handleChange} placeholder="Image URL" />
                      <input className="premium-input" name="tags" value={editForm.tags} onChange={handleChange} placeholder="Tags (séparés par virgules)" />
                      <select className="premium-input" name="status" value={editForm.status} onChange={handleChange}>
                        <option value="active">Actif</option>
                        <option value="paused">En pause</option>
                        <option value="cancelled">Annulé</option>
                      </select>

                      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 space-y-3">
                        <p className="text-xs font-black uppercase tracking-widest text-gray-500">Types de tickets</p>
                        {editTicketTypes.map((ticketType) => (
                          <div key={ticketType.id} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center bg-white border border-gray-100 rounded-xl p-3">
                            <input className="premium-input" value={ticketType.name} onChange={(targetEvent) => handleTicketTypeChange(ticketType.id, 'name', targetEvent.target.value)} placeholder="Nom" />
                            <input className="premium-input" type="number" min="0" value={ticketType.price} onChange={(targetEvent) => handleTicketTypeChange(ticketType.id, 'price', targetEvent.target.value)} placeholder="Prix" />
                            <input className="premium-input" type="number" min={ticketType.sold || 0} value={ticketType.quantity} onChange={(targetEvent) => handleTicketTypeChange(ticketType.id, 'quantity', targetEvent.target.value)} placeholder="Quantité" />
                            <input className="premium-input" value={ticketType.benefits} onChange={(targetEvent) => handleTicketTypeChange(ticketType.id, 'benefits', targetEvent.target.value)} placeholder="Bénéfices" />
                            <button type="button" onClick={() => removeTicketType(ticketType.id)} className="text-xs font-bold uppercase tracking-wider text-red-600 hover:text-red-700">
                              Retirer
                            </button>
                          </div>
                        ))}

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                          <input className="premium-input" name="name" value={ticketDraft.name} onChange={handleTicketDraftChange} placeholder="Nouveau ticket" />
                          <input className="premium-input" name="price" type="number" min="0" value={ticketDraft.price} onChange={handleTicketDraftChange} placeholder="Prix" />
                          <input className="premium-input" name="quantity" type="number" min="1" value={ticketDraft.quantity} onChange={handleTicketDraftChange} placeholder="Quantité" />
                          <input className="premium-input" name="benefits" value={ticketDraft.benefits} onChange={handleTicketDraftChange} placeholder="Bénéfices" />
                        </div>
                        <button type="button" onClick={addTicketType} className="w-full border border-primary text-primary rounded-2xl py-3 font-bold text-sm hover:bg-primary hover:text-white transition-colors">
                          Ajouter un type de ticket
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => handleSave(event.id)}
                          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-white font-bold text-sm hover:bg-primary-700 transition-colors"
                        >
                          <Save className="w-4 h-4" /> Enregistrer
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-gray-200 text-gray-700 font-bold text-sm hover:border-gray-300 transition-colors"
                        >
                          <X className="w-4 h-4" /> Annuler
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default OrganizerEventsPage;
