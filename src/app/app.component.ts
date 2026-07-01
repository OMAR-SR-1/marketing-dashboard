import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-slate-100 font-sans text-slate-800">
      <nav class="bg-white shadow-sm border-b border-slate-200 px-6 py-4">
        <div class="flex justify-between items-center max-w-7xl mx-auto">
          <span class="text-xl font-bold text-indigo-600">Omar.Dev</span>
          <span class="text-sm bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium">Dashboard Actif</span>
        </div>
      </nav>

      <main class="max-w-7xl mx-auto p-6 lg:p-8">
        <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div>
            <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Tableau de Bord Commercial</h1>
            <p class="text-slate-500 mt-1">Analyse des indicators de performance et de l'activité e-commerce.</p>
          </div>
          
          <div class="flex bg-white p-1 rounded-xl border border-slate-200 shadow-xs self-start md:self-center">
            <button *ngFor="let period of ['today', 'week', 'month']" 
                    (click)="changePeriod(period)"
                    [ngClass]="activePeriod === period ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'"
                    class="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 capitalize">
              {{ period === 'today' ? "Aujourd'hui" : period === 'week' ? 'Cette semaine' : 'Ce mois' }}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div *ngFor="let kpi of currentKpis" class="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/60 transition-all duration-300 transform hover:-translate-y-0.5">
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">{{ kpi.title }}</p>
            <div class="flex items-baseline justify-between mt-3">
              <span class="text-2xl font-bold text-slate-900">{{ kpi.value }}</span>
              <span [ngClass]="kpi.positive ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'" 
                    class="text-xs font-bold px-2.5 py-1 rounded-full">
                {{ kpi.change }}
              </span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div class="lg:col-span-2 bg-white p-6 rounded-2xl shadow-xs border border-slate-200/60">
            <h3 class="text-lg font-bold text-slate-900 mb-4">Évolution du Chiffre d'Affaires</h3>
            <div class="relative h-64">
              <canvas #salesChart></canvas>
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/60">
            <h3 class="text-lg font-bold text-slate-900 mb-4">Top Articles Vendus</h3>
            <div class="space-y-4">
              <div *ngFor="let product of currentProducts" class="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100 transition-all duration-200 hover:bg-slate-100/70">
                <div>
                  <p class="text-sm font-semibold text-slate-900">{{ product.name }}</p>
                  <p class="text-xs text-slate-500 mt-0.5">{{ product.sales }} unités vendues</p>
                </div>
                <span class="text-sm font-bold text-indigo-600">{{ product.revenue }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/60">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-bold text-slate-900">Suivi Campagnes & Publications (OmarExclusive)</h3>
            <span class="text-xs font-semibold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md">Facebook API Source</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div *ngFor="let post of facebookPosts" class="border border-slate-100 bg-slate-50/50 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-center text-xs text-slate-400 mb-3">
                  <span>{{ post.date }}</span>
                  <span class="font-medium px-2 py-0.5 rounded bg-white border border-slate-100 text-slate-500">{{ post.type }}</span>
                </div>
                <p class="text-sm text-slate-700 line-clamp-3 mb-4 leading-relaxed">{{ post.content }}</p>
              </div>
              <div class="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center text-xs font-semibold text-slate-500">
                <div>
                  <p class="text-slate-400 font-normal text-[10px] uppercase">Likes</p>
                  <p class="mt-0.5 text-slate-800">{{ post.likes }}</p>
                </div>
                <div>
                  <p class="text-slate-400 font-normal text-[10px] uppercase">Partages</p>
                  <p class="mt-0.5 text-slate-800">{{ post.shares }}</p>
                </div>
                <div>
                  <p class="text-slate-400 font-normal text-[10px] uppercase">Clicks</p>
                  <p class="mt-0.5 text-indigo-600">{{ post.clicks }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `
})
export class App implements OnInit, AfterViewInit {
  @ViewChild('salesChart') salesChart!: ElementRef;
  chartInstance!: Chart;
  activePeriod: string = 'week';

  facebookPosts = [
    {
      date: 'Hier, 14:20',
      type: 'Organique',
      content: 'Nouvelle Collection Été ! Découvrez nos ensembles légers et élégants disponibles dès maintenant en boutique et en ligne. Quantités limitées.',
      likes: 245,
      shares: 38,
      clicks: 184
    },
    {
      date: '28 Juin, 09:15',
      type: 'Sponsorisé',
      content: 'Style, confort et tradition. L’ensemble Casual SenStyle s’adapte à toutes vos journées. Commandez le vôtre en DM ou sur notre site.',
      likes: 1230,
      shares: 142,
      clicks: 895
    },
    {
      date: '25 Juin, 18:00',
      type: 'Vidéo',
      content: '',
      likes: 512,
      shares: 89,
      clicks: 340
    }
  ];

  dataRepo: any = {
    today: {
      kpis: [
        { title: "Chiffre d'Affaires", value: '142 500 FCFA', change: '+3.8%', positive: true },
        { title: "Taux d'Engagement", value: '5.14%', change: '+0.4%', positive: true },
        { title: 'Nouveaux Abonnés', value: '+14', change: '+2.1%', positive: true },
        { title: 'Commandes Réussies', value: '7', change: '-4.2%', positive: false }
      ],
      labels: ['08h', '10h', '12h', '14h', '16h', '18h', '20h'],
      sales: [12500, 28000, 42500, 19000, 11000, 24500, 5000],
      products: [
        { name: 'Ensemble Costume', sales: 3, revenue: '45 000 FCFA' },
        { name: 'Accessoires Wax', sales: 2, revenue: '18 500 FCFA' },
        { name: 'Robe Collection Été', sales: 1, revenue: '15 000 FCFA' }
      ]
    },
    week: {
      kpis: [
        { title: "Chiffre d'Affaires", value: '1 246 800 FCFA', change: '+11.4%', positive: true },
        { title: "Taux d'Engagement", value: '4.78%', change: '+1.1%', positive: true },
        { title: 'Nouveaux Abonnés', value: '+342', change: '-1.8%', positive: false },
        { title: 'Commandes Réussies', value: '86', change: '+7.3%', positive: true }
      ],
      labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      sales: [118000, 149500, 178000, 89000, 246000, 312000, 154300],
      products: [
        { name: 'Ensemble costume', sales: 44, revenue: '660 000 FCFA' },
        { name: 'Robe  Été', sales: 27, revenue: '405 000 FCFA' },
        { name: 'Accessoires Wax', sales: 19, revenue: '181 800 FCFA' }
      ]
    },
    month: {
      kpis: [
        { title: "Chiffre d'Affaires", value: '5 784 000 FCFA', change: '+22.6%', positive: true },
        { title: "Taux d'Engagement", value: '4.15%', change: '+0.7%', positive: true },
        { title: 'Nouveaux Abonnés', value: '+1 395', change: '+14.2%', positive: true },
        { title: 'Commandes Réussies', value: '408', change: '+16.5%', positive: true }
      ],
      labels: ['Semaine 1', 'Semaine 2', 'Semaine 3', 'Semaine 4'],
      sales: [1120000, 1385000, 1790000, 1489000],
      products: [
        { name: 'Ensemble Costume', sales: 184, revenue: '2 760 000 FCFA' },
        { name: 'Robe Collection Été', sales: 115, revenue: '1 725 000 FCFA' },
        { name: 'Accessoires Wax', sales: 78, revenue: '744 000 FCFA' }
      ]
    }
  };

  get currentKpis() { return this.dataRepo[this.activePeriod].kpis; }
  get currentProducts() { return this.dataRepo[this.activePeriod].products; }

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initChart();
    }
  }

  initChart() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
    const periodData = this.dataRepo[this.activePeriod];
    this.chartInstance = new Chart(this.salesChart.nativeElement, {
      type: 'line',
      data: {
        labels: periodData.labels,
        datasets: [{
          label: 'Ventes (FCFA)',
          data: periodData.sales,
          borderColor: '#4f46e5',
          backgroundColor: 'rgba(79, 70, 229, 0.08)',
          fill: true,
          tension: 0.35,
          borderWidth: 3,
          pointRadius: 4,
          pointBackgroundColor: '#4f46e5'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { grid: { color: '#f1f5f9' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  changePeriod(period: string) {
    this.activePeriod = period;
    setTimeout(() => {
      this.initChart();
    }, 50);
  }
}