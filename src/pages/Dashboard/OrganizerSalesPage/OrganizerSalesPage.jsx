import React, { useMemo, useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, MapPin, Ticket, User, Wallet } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { usePlatform } from '../../../context/PlatformContext';

const OrganizerSalesPage = () => {
  const { user } = useAuth();
  const { getOrganizerTickets } = usePlatform();
  const [openedEventId, setOpenedEventId] = useState(null);

  const groupedSales = useMemo(() => {
    const tickets = getOrganizerTickets(user);
    const grouped = tickets.reduce((accumulator, ticket) => {
      if (!accumulator[ticket.eventId]) {
        accumulator[ticket.eventId] = {
          eventId: ticket.eventId,
          eventTitle: ticket.eventTitle,
          eventDate: ticket.eventDate,
          eventLocation: ticket.eventLocation,
          eventImage: ticket.eventImage,
          tickets: [],
          revenue: 0
        };
      }

      accumulator[ticket.eventId].tickets.push(ticket);
      accumulator[ticket.eventId].revenue += Number(ticket.price || 0);

      return accumulator;
    }, {});

    return Object.values(grouped).sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
  }, [getOrganizerTickets, user]);

  const toggleEvent = (eventId) => {
    setOpenedEventId((previous) => (previous === eventId ? null : eventId));
  };

  return (
    <section className="min-h-[calc(100vh-5rem)] px-4 py-10 md:py-14 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="container mx-auto space-y-8">
        <div className="space-y-3">
          <p className="premium-badge">Dashboard Organisateur</p>
          <h1 className="text-3xl md:text-5xl font-black text-dark italic uppercase tracking-tight">Derniers tickets vendus</h1>
          <p className="text-gray-600">Clique sur un événement pour voir tous les tickets vendus et leurs infos.</p>
        </div>

        {groupedSales.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <p className="text-gray-600 font-semibold">Aucune vente pour le moment.</p>
            <p className="text-sm text-gray-500 mt-1">Les ventes apparaîtront ici, regroupées par événement.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {groupedSales.map((group) => {
              const isOpen = openedEventId === group.eventId;
              const scannedCount = group.tickets.filter((ticket) => ticket.status === 'USED').length;

              return (
                <article key={group.eventId} className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                  <button
                    type="button"
                    onClick={() => toggleEvent(group.eventId)}
                    className="w-full text-left flex flex-wrap items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={group.eventImage || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=320&h=160&fit=crop'}
                        alt={group.eventTitle}
                        className="w-20 h-16 rounded-xl object-cover"
                      />
                      <div className="min-w-0">
                        <h2 className="text-lg font-black text-dark truncate">{group.eventTitle}</h2>
                        <p className="text-sm text-gray-600 flex items-center gap-2"><Calendar className="w-4 h-4" />{new Date(group.eventDate).toLocaleString('fr-FR')}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-2"><MapPin className="w-4 h-4" />{group.eventLocation}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <span className="inline-flex items-center gap-1 text-gray-700"><Ticket className="w-4 h-4" />{group.tickets.length} tickets</span>
                      <span className="inline-flex items-center gap-1 text-primary font-black"><Wallet className="w-4 h-4" />{group.revenue.toLocaleString()} FCFA</span>
                      {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                    </div>
                  </button>

                  {isOpen ? (
                    <div className="mt-4 border-t border-gray-100 pt-4 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
                          <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">Total ventes</p>
                          <p className="text-xl font-black text-dark mt-1">{group.tickets.length}</p>
                        </div>
                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
                          <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">Scannés</p>
                          <p className="text-xl font-black text-primary mt-1">{scannedCount}</p>
                        </div>
                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
                          <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">En attente</p>
                          <p className="text-xl font-black text-green-600 mt-1">{group.tickets.length - scannedCount}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {group.tickets.map((ticket) => (
                          <div key={ticket.id} className="rounded-2xl border border-gray-100 bg-white p-4 flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-black text-dark">{ticket.ticketTypeName} • {ticket.price.toLocaleString()} FCFA</p>
                              <p className="text-xs text-gray-500 mt-1 font-mono">{ticket.code}</p>
                            </div>
                            <div className="text-sm text-gray-600">
                              <p className="inline-flex items-center gap-2"><User className="w-4 h-4" />{ticket.buyerName} ({ticket.buyerEmail})</p>
                              <p className="mt-1">{ticket.status === 'USED' ? `Scanné le ${new Date(ticket.usedAt).toLocaleString('fr-FR')}` : 'Non scanné'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default OrganizerSalesPage;