import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Slide {
  foto: string;
  dialogo: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  showIntro = true;
  currentIndex = 0;
  typedText = '';
  isTyping = false;
  showEnd = false;
  animating = false;

  private typeTimerId: ReturnType<typeof setTimeout> | null = null;

  slides: Slide[] = [
    {
      foto: 'assets/messifoto1.png',
      dialogo: 'Alo Ana, ¡qué tal! Acá te saluda Leo Messi.'
    },
    {
      foto: 'assets/messifoto2.png',
      dialogo: 'Me entere que recientemente tuviste un día complicado... y vine a hacerte compañía un rato.'
    },
    {
      foto: 'assets/messifoto3.png',
      dialogo: 'Lo que te pasó no está bien. Y que te duela no significa que seas débil, significa que esas cosas importaban. Está bien estar enojada y sentir cosas. A cualquiera le pudo haber pasado.'
    },
    {
      foto: 'assets/messifoto4.png',
      dialogo: 'Mirá, a mí me tocaron momentos en que todo se me derrumbaba. La final del 2014, los abucheos... sentí que el mundo se me caía encima. Incluso renuncie por un tiempo.'
    },
    {
      foto: 'assets/messifoto5.png',
      dialogo: 'Pero también te acordás lo que pasó después, ¿verdad? Llegó 2022 y salimos campeones del mundo. ¿Qué quiero decir con esto? Que siempre hay luz al final del túnel. Habrá tiempos mejores. Creeme.'
    },
    {
      foto: 'assets/messifoto6.png',
      dialogo: 'Escuchame una cosa: tu tesis, tus años en la U, tu ser, todo lo que aprendiste... eso está dentro de vos. En tu cabeza. Y eso nadie te lo puede quitar.'
    },
    {
      foto: 'assets/messifoto7.png',
      dialogo: 'Y encima los hdp se llevaron el maquillaje... eso sí que no tiene perdón. Aunque che, igual te ves linda.'
    },
    {
      foto: 'assets/messifoto8.png',
      dialogo: 'Arriba, campeona. Este partido recién empieza.'
    }
  ];

  get currentSlide(): Slide {
    return this.slides[this.currentIndex];
  }

  get isLastSlide(): boolean {
    return this.currentIndex === this.slides.length - 1;
  }

  get progress(): string {
    return `${this.currentIndex + 1} / ${this.slides.length}`;
  }

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {}

  startConversation() {
    this.showIntro = false;
    this.startTyping();
  }

  ngOnDestroy() {
    if (this.typeTimerId) clearTimeout(this.typeTimerId);
  }

  next() {
    if (this.animating) return;
    if (this.isTyping) {
      this.skipTyping();
      return;
    }
    if (this.isLastSlide) {
      this.showEnd = true;
      return;
    }
    this.animating = true;
    setTimeout(() => {
      this.currentIndex++;
      this.animating = false;
      this.startTyping();
      this.cdr.detectChanges();
    }, 300);
  }

  prev() {
    if (this.animating) return;
    if (this.isTyping) {
      this.skipTyping();
      return;
    }
    if (this.currentIndex === 0) {
      this.showIntro = true;
      return;
    }
    this.animating = true;
    setTimeout(() => {
      this.currentIndex--;
      this.animating = false;
      this.startTyping();
      this.cdr.detectChanges();
    }, 300);
  }

  restart() {
    this.showEnd = false;
    this.showIntro = true;
    this.currentIndex = 0;
    this.typedText = '';
  }

  skipTyping() {
    if (this.typeTimerId) clearTimeout(this.typeTimerId);
    this.typedText = this.currentSlide.dialogo;
    this.isTyping = false;
    this.cdr.detectChanges();
  }

  startTyping() {
    this.typedText = '';
    this.isTyping = true;
    this.typeChar(0);
  }

  private typeChar(index: number) {
    if (index <= this.currentSlide.dialogo.length) {
      this.typedText = this.currentSlide.dialogo.slice(0, index);
      this.cdr.detectChanges();
      this.typeTimerId = setTimeout(() => this.typeChar(index + 1), 35);
    } else {
      this.isTyping = false;
      this.cdr.detectChanges();
    }
  }
}