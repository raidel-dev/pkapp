import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { TrainingVideosPage } from '../training-videos/training-videos';
import { SampleUtilityBillsPage } from '../../../sampleutilitybills/sample-utility-bills';

@IonicPage()
@Component({
  selector: 'page-faqs',
  templateUrl: 'faqs.html',
})
export class FaqsPage {
  public faqs = [
    {
      question: '"What does my bill look like?"',
      answer: 'Find out',
      route: SampleUtilityBillsPage
    },
    {
      question: '"How can you save me 20-40% on my energy bill?"',
      answer: 'If you live in a state where energy\'s deregulated, you may be able to save considerably on your current bill by switching your electricity and natural gas suppliers. This depends on your state and local utility.<br><br>By showing you the best energy rates in your area all at once, the Power Kiosk platform acts as a marketplace where each supplier competes to win your business. We also work hand-in-hand with our partners to offer special online rates &mdash; lower than you\'ll find elsewhere.'
    },
    { 
      question: '"How do I know Power Kiosk energy rates are competitive?"',
      answer: 'Thanks to years of industry experience, broker relationships, and the competition introduced by our proprietary comparison shopping technology, we\'re able to offer you competitive electricity and natural gas rates on the market. And unlike junk-mail promotional offers, Power Kiosk rates are fixed &mdash; guaranteed &mdash; over the course of your plan. They don\'t go up after you switch.<br><br>State-by-state, you\'ll see that shorter-term plans can be cheaper than long-term plans, OR vice-versa. This depends on factors like wholesale market forecast (supply/demand) for each state.<br><br>The competitive prices come from reputable and vetted suppliers with a track record of delivering high-quality service.'
    },
    {
      question: '"Are there any other reasons I should switch?"',
      answer: 'In deregulated states, there are a couple very good reasons to evaluate your current supply plan and switch using Power Kiosk EVEN IF the potential rate savings isn\'t considerable.<br><br>1) Fixed rate vs. variable rate<br>All Power Kiosk Direct supply rates are fixed for residential and small business customers, meaning you pay a fixed cost for energy over the time period you see listed for each plan. (Large commercial account? Depending on your business needs and market conditions, we can negotiate variable terms directly with suppliers.) No "act now" promotional rates, no airline mile gimmicks, and, most importantly, your rate doesn\'t spike due to changes in the wholesale market.<br><br>If you\'re not sure whether your existing plan is fixed or variable, see "[usage] kWh x [rate]" under the Supply or Generation Charges section on your bill that shows your current rate, and check it against past bills online (or call your local utility).<br><br>2) Going green: eco-friendly energy<br>Looking for clean energy options — like electricity produced by renewable resources? In many markets Power Kiosk has cost-effective renewable energy plans available that can help you reduce your footprint today.<br><br>"Going green" shouldn\'t have to break the bank. We\'re working with our electricity &amp; natural gas partners to bring additional green energy plans to every market we serve.'
    },
    {
      question: '"What does the "green %" mean next to each plan?"',
      answer: 'It indicates the approximate % of a plan\'s energy supply that comes from renewable sources &mdash; like solar, geothermal, hydroelectric or wind.'
    },
    {
      question: '"How long does it take to switch &mdash; can I switch today?"',
      answer: 'Yes, you can switch securely in 5 minutes or less with a copy of your current bill! No paper forms to fill out, no mailing necessary.<br><br>There\'s no interruption in your service, no switch fee, and you\'ll get the same bill from your local utility.<br><br>The switch time varies for each utility company and can take a few weeks for an effective switch to happen.'
    },
    {
      question: '"Once I\'ve signed up, is that it? How do I renew my plan?"',
      answer: 'Once you complete the sign-up process and receive a confirmation email with the details of your plan (rate/plan duration/supplier), just: 1) save the confirmation email for your records (the sender will appear as "support@octipower.com"), and 2) look for the switch to be reflected on your next utility bill.<br><br>To renew your Power Kiosk plan, it\'s just as easy: we\'ll send e-reminders to the email address we have on file 6 months, 3 months, and 1 month prior to your contract expiration date with a link that shows you new options to renew with the best offers at the time. When your plan ends, you can also simply renew at the same terms &mdash; no sign-up required.<br><br>NOTE: If you opt to switch plans, just be sure to set your new start date the day after your previous plan\'s end date. Otherwise, your existing plan is set to renew on that date instead.'
    },
    {
      question: '"What happens if I change service addresses?"',
      answer: 'Moving\'s a pain &mdash; we hear you. The last thing you want to think about when moving to a new residence or business location is switching service/mailing addresses.<br><br>When changing your address, first contact your supplier to go discuss special offers when you move. If service is not available at your new address, you can come back to shop for the best offers for your new address. You\'ll then start a completely new contract. For plans with cancellation fees listed, these apply only in "early termination" situations where the service is actively cancelled before the end of a contract term.'
    }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  public goTrainingVideos() {
    this.navCtrl.push(TrainingVideosPage);
  }

  public goRoute(route: any): void {
    this.navCtrl.push(route);
  }
}
