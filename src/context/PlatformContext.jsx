import React, { createContext, useContext, useMemo, useState } from 'react';
import { mockEvents } from '../mock-data/events';

const PlatformContext = createContext();

const ORGANIZER_EVENTS_KEY = 'evenflow_organizer_events';
const TICKETS_KEY = 'evenflow_tickets';

const readLocalStorageArray = (key) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : [];
  } catch (error) {
    localStorage.removeItem(key);
    return [];
  }
};

const generateId = (prefix) => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
};

const generateTicketCode = () => {
  const uuidChunk = (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID().replace(/-/g, '').slice(0, 10).toUpperCase()
    : Math.random().toString(36).slice(2, 12).toUpperCase();
  return `EVF-${Date.now().toString().slice(-6)}-${uuidChunk}`;
};

export const PlatformProvider = ({ children }) => {
  const [organizerEvents, setOrganizerEvents] = useState(() => readLocalStorageArray(ORGANIZER_EVENTS_KEY));
  const [tickets, setTickets] = useState(() => readLocalStorageArray(TICKETS_KEY));

  const persistOrganizerEvents = (nextEvents) => {
    setOrganizerEvents(nextEvents);
    localStorage.setItem(ORGANIZER_EVENTS_KEY, JSON.stringify(nextEvents));
  };

  const persistTickets = (nextTickets) => {
    setTickets(nextTickets);
    localStorage.setItem(TICKETS_KEY, JSON.stringify(nextTickets));
  };

  const createOrganizerEvent = (payload, organizer) => {
    const sold = 0;
    const normalizedTicketTypes = Array.isArray(payload.ticketTypes) && payload.ticketTypes.length > 0
      ? payload.ticketTypes.map((ticketType) => ({
        id: generateId('ticket-type'),
        name: ticketType.name,
        price: Number(ticketType.price),
        currency: 'FCFA',
        description: `Billet ${ticketType.name}`,
        benefits: Array.isArray(ticketType.benefits) && ticketType.benefits.length > 0 ? ticketType.benefits : ['Accès à l’événement'],
        quantity: Number(ticketType.quantity),
        sold
      }))
      : [
        {
          id: generateId('ticket-type'),
          name: payload.ticketName || 'Standard',
          price: Number(payload.ticketPrice || 0),
          currency: 'FCFA',
          description: payload.ticketDescription || `Billet ${payload.ticketName || 'Standard'}`,
          benefits: payload.ticketBenefits
            ? payload.ticketBenefits.split(',').map((item) => item.trim()).filter(Boolean)
            : ['Accès à l’événement'],
          quantity: Number(payload.ticketQuantity || 100),
          sold
        }
      ];

    const totalQuantity = normalizedTicketTypes.reduce((acc, ticketType) => acc + ticketType.quantity, 0);

    const event = {
      id: generateId('event-org'),
      title: payload.title,
      slug: String(payload.title || 'event').toLowerCase().replace(/\s+/g, '-'),
      description: payload.description,
      shortDescription: payload.shortDescription || payload.description,
      category: String(payload.category || 'festival').toLowerCase(),
      date: payload.date,
      endDate: payload.endDate || payload.date,
      location: payload.location,
      city: payload.city || payload.location,
      address: payload.address || payload.location,
      organizerId: organizer.id,
      organizer: {
        id: organizer.id,
        name: organizer.name,
        logo: organizer.avatar || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&h=200&fit=crop',
        verified: true
      },
      images: {
        main: payload.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=600&fit=crop',
        gallery: [payload.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=600&fit=crop']
      },
      tickets: {
        total: totalQuantity,
        sold,
        available: Math.max(totalQuantity - sold, 0),
        types: normalizedTicketTypes
      },
      status: 'active',
      featured: false,
      trending: false,
      tags: payload.tags
        ? payload.tags.split(',').map((item) => item.trim()).filter(Boolean)
        : ['nouveau'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const nextEvents = [event, ...organizerEvents];
    persistOrganizerEvents(nextEvents);
    return event;
  };

  const updateOrganizerEvent = (eventId, updates, organizer) => {
    const targetEvent = organizerEvents.find((event) => event.id === eventId);

    if (!targetEvent) {
      return { ok: false, message: 'Événement introuvable.' };
    }

    if (!organizer || targetEvent.organizerId !== organizer.id) {
      return { ok: false, message: 'Vous ne pouvez pas modifier cet événement.' };
    }

    const hasStarted = new Date(targetEvent.date) <= new Date();
    if (hasStarted) {
      return { ok: false, message: 'Modification impossible après la date de début.' };
    }

    const normalizedTicketTypes = Array.isArray(updates.ticketTypes) && updates.ticketTypes.length > 0
      ? updates.ticketTypes.map((ticketType) => ({
        id: ticketType.id || generateId('ticket-type'),
        name: ticketType.name,
        price: Number(ticketType.price || 0),
        currency: 'FCFA',
        description: ticketType.description || `Billet ${ticketType.name}`,
        benefits: Array.isArray(ticketType.benefits) && ticketType.benefits.length > 0
          ? ticketType.benefits
          : ['Accès à l’événement'],
        quantity: Number(ticketType.quantity || 0),
        sold: Number(ticketType.sold || 0)
      }))
      : targetEvent.tickets.types;

    const totalQuantity = normalizedTicketTypes.reduce((acc, ticketType) => acc + Number(ticketType.quantity || 0), 0);
    const totalSold = normalizedTicketTypes.reduce((acc, ticketType) => acc + Number(ticketType.sold || 0), 0);

    const updatedEvent = {
      ...targetEvent,
      title: updates.title ?? targetEvent.title,
      description: updates.description ?? targetEvent.description,
      shortDescription: updates.shortDescription ?? updates.description ?? targetEvent.shortDescription,
      category: updates.category ?? targetEvent.category,
      date: updates.date ?? targetEvent.date,
      endDate: updates.endDate ?? targetEvent.endDate,
      location: updates.location ?? targetEvent.location,
      city: updates.city ?? targetEvent.city,
      address: updates.address ?? targetEvent.address,
      status: updates.status ?? targetEvent.status,
      tags: Array.isArray(updates.tags)
        ? updates.tags
        : (typeof updates.tags === 'string'
          ? updates.tags.split(',').map((item) => item.trim()).filter(Boolean)
          : targetEvent.tags),
      images: {
        ...targetEvent.images,
        main: updates.image || targetEvent.images?.main || targetEvent.image,
        gallery: updates.image ? [updates.image, ...(targetEvent.images?.gallery || []).filter((img) => img !== updates.image)] : (targetEvent.images?.gallery || [])
      },
      tickets: {
        ...targetEvent.tickets,
        total: totalQuantity,
        sold: totalSold,
        available: Math.max(totalQuantity - totalSold, 0),
        types: normalizedTicketTypes
      },
      updatedAt: new Date().toISOString()
    };

    const nextEvents = organizerEvents.map((event) => (event.id === eventId ? updatedEvent : event));
    persistOrganizerEvents(nextEvents);

    return { ok: true, message: 'Événement mis à jour.', event: updatedEvent };
  };

  const allEvents = useMemo(() => [...organizerEvents, ...mockEvents], [organizerEvents]);

  const getEventById = (eventId) => {
    return allEvents.find((event) => event.id === eventId) || null;
  };

  const purchaseFromCart = (cart, buyer) => {
    const generatedTickets = [];
    const existingCodes = new Set(tickets.map((ticket) => ticket.code));

    cart.forEach((item) => {
      for (let i = 0; i < item.quantity; i += 1) {
        let uniqueCode = generateTicketCode();
        while (existingCodes.has(uniqueCode)) {
          uniqueCode = generateTicketCode();
        }
        existingCodes.add(uniqueCode);

        const newTicket = {
          id: generateId('ticket'),
          code: uniqueCode,
          status: 'ACTIVE',
          issuedAt: new Date().toISOString(),
          usedAt: null,
          eventId: item.event.id,
          eventTitle: item.event.title,
          eventDate: item.event.date,
          eventLocation: item.event.location,
          eventImage: item.event.images?.main || item.event.image || null,
          ticketTypeId: item.ticketType.id,
          ticketTypeName: item.ticketType.name,
          price: item.ticketType.price,
          organizerId: item.event.organizerId || item.event.organizer?.id || null,
          organizerName: item.event.organizer?.name || 'Organisateur',
          buyerId: buyer.id,
          buyerName: buyer.name,
          buyerEmail: buyer.email
        };

        generatedTickets.push(newTicket);
      }
    });

    const nextTickets = [...generatedTickets, ...tickets];
    persistTickets(nextTickets);

    return generatedTickets;
  };

  const verifyTicketByCode = (code, organizerId, expectedEventId = null) => {
    if (!code) {
      return { ok: false, message: 'Code QR manquant.' };
    }

    const normalizedCode = String(code).trim().toUpperCase();
    const foundTicket = tickets.find((ticket) => ticket.code.toUpperCase() === normalizedCode);

    if (!foundTicket) {
      return { ok: false, message: 'Ticket introuvable.' };
    }

    if (organizerId && foundTicket.organizerId && organizerId !== foundTicket.organizerId) {
      return { ok: false, message: 'Ce ticket ne vous appartient pas.' };
    }

    if (expectedEventId && foundTicket.eventId !== expectedEventId) {
      return { ok: false, message: 'Ce ticket n’appartient pas à cet événement.', ticket: foundTicket };
    }

    if (foundTicket.status === 'USED') {
      return { ok: false, message: 'Ticket déjà utilisé.', ticket: foundTicket };
    }

    const nextTickets = tickets.map((ticket) => {
      if (ticket.id !== foundTicket.id) return ticket;
      return {
        ...ticket,
        status: 'USED',
        usedAt: new Date().toISOString(),
        scannedBy: organizerId || null
      };
    });

    persistTickets(nextTickets);

    const updated = nextTickets.find((ticket) => ticket.id === foundTicket.id);
    return { ok: true, message: 'Ticket validé avec succès.', ticket: updated };
  };

  const getBuyerTickets = (buyer) => {
    if (!buyer) return [];
    return tickets
      .filter((ticket) => ticket.buyerId === buyer.id || ticket.buyerEmail === buyer.email)
      .sort((a, b) => new Date(b.issuedAt) - new Date(a.issuedAt));
  };

  const getOrganizerEvents = (organizer) => {
    if (!organizer) return [];
    return organizerEvents
      .filter((event) => event.organizerId === organizer.id)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const getOrganizerEventById = (eventId, organizer) => {
    if (!organizer) return null;
    return organizerEvents.find((event) => event.id === eventId && event.organizerId === organizer.id) || null;
  };

  const getOrganizerTickets = (organizer) => {
    if (!organizer) return [];
    return tickets
      .filter((ticket) => ticket.organizerId === organizer.id)
      .sort((a, b) => new Date(b.issuedAt) - new Date(a.issuedAt));
  };

  const value = {
    allEvents,
    tickets,
    createOrganizerEvent,
    updateOrganizerEvent,
    getEventById,
    purchaseFromCart,
    verifyTicketByCode,
    getBuyerTickets,
    getOrganizerEvents,
    getOrganizerEventById,
    getOrganizerTickets
  };

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
};

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
};
