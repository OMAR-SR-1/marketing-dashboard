import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  getDashboardData() {
    return of({
      kpis: [
        { title: "Chiffre d'Affaires", value: '1 250 000 FCFA', change: '+12%', positive: true },
        { title: "Taux d'Engagement", value: '4.8%', change: '+1.2%', positive: true },
        { title: 'Nouveaux Abonnés', value: '+350', change: '-2%', positive: false },
        { title: 'Commandes Réussies', value: '89', change: '+8%', positive: true }
      ],
      salesData: [120000, 150000, 180000, 90000, 250000, 310000, 150000],
      salesLabels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      topProducts: [
        { name: 'Ensemble Casual SenStyle', sales: 45, revenue: '675 000 FCFA' },
        { name: 'Robe Collection Été', sales: 28, revenue: '420 000 FCFA' },
        { name: 'Accessoires Wax', sales: 16, revenue: '155 000 FCFA' }
      ]
    });
  }
}