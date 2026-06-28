"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";

type Flavor = { name: string; arabic: string; price: number };

type MenuItem = {
  name: string;
  arabic: string;
  price: number;
  image: string;
  images?: string[];
  flavors?: Flavor[];
};

const categories = [
  {
    name: "Milkshakes",
    arabic: "ميلك شيك",
    priceTag: "9 each",
    emoji: "🥤",
    items: [
      { name: "Oreo Milkshake", arabic: "ميلك شيك أوريو", price: 9, image: "7ea6d69108ecd36db9f8f8debcd35bbd-removebg-preview.png" },
      { name: "Lotus Milkshake", arabic: "ميلك شيك لوتس", price: 9, image: "lotusshake.png" },
      { name: "Pistachio Milkshake", arabic: "ميلك شيك فستق", price: 9, image: "Pistachioshake.png" },
      { name: "Chocolate Milkshake", arabic: "ميلك شيك شوكولاتة", price: 9, image: "chocolatemilkshake.png" },
      { name: "Vanilla Milkshake", arabic: "ميلك شيك فانيليا", price: 9, image: "vanilla.png" },
    ],
  },
  {
    name: "Coffee",
    arabic: "قهوة",
    emoji: "☕",
    items: [
      { name: "Iced Coffee", arabic: "ايس كوفي", price: 6, image: "iceclatte.png" },
      { name: "Espresso", arabic: "إسبرسو", price: 3, image: "espresso.png" },
    ],
  },
  {
    name: "Desserts",
    arabic: "حلويات",
    emoji: "🧁",
    items: [
      { name: "Crepe", arabic: "كريب", price: 8, image: "crepe.png" },
      { name: "Crepe Nutella", arabic: "كريب نوتيلا", price: 10, image: "crepe.png" },
      { name: "Crepe Noodles", arabic: "كريب نودلز", price: 12, image: "crepCup.png" },
    ],
  },
  {
    name: "Mojitos & Drinks",
    arabic: "موهيتو ومشروبات",
    emoji: "🍹",
    items: [
      {
        name: "Mojito",
        arabic: "موهيتو",
        price: 8,
        image: "mojitoo11.png",
        images: ["mojitoo11.png", "mojito12.png"],
        flavors: [
          { name: "Strawberry", arabic: "فراولة", price: 8 },
          { name: "Blueberry", arabic: "توت", price: 8 },
          { name: "Watermelon", arabic: "بطيخ", price: 8 },
          { name: "Lemon", arabic: "ليمون", price: 8 },
          { name: "Pineapple", arabic: "أناناس", price: 8 },
          { name: "Wild Berry", arabic: "بيري بري", price: 8 },
          { name: "Kiwi", arabic: "كيوي", price: 8 },
          { name: "Raspberry", arabic: "توت أحمر", price: 8 },
        ],
      },
      { name: "Passion Fruit", arabic: "مسفلوره", price: 5, image: "passionfruit.png" },
      { name: "Slush", arabic: "سلاش", price: 3, image: "slush.png" },
    ],
  },
];

function CoffeeLogo() {
  return (
    <div className="relative w-8 h-8 md:w-9 md:h-9">
      <Image src="/images/logoo.png" alt="MUKHMAS" fill className="object-contain" />
    </div>
  );
}

function ArrowButton({ direction, onClick, disabled }: { direction: "prev" | "next"; onClick: () => void; disabled: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="embla__button absolute top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-[var(--color-surface-3)]/90 backdrop-blur-md border border-[var(--color-border)] flex items-center justify-center text-[var(--color-cream)] hover:bg-[var(--color-surface-3)] hover:border-[var(--color-gold-soft)] hover:text-[var(--color-gold)] transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none shadow-xl"
      style={direction === "prev" ? { left: "12px" } : { right: "12px" }}
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d={direction === "prev" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
      </svg>
    </button>
  );
}

function FlavorModal({ item, onClose }: { item: MenuItem & { flavors: Flavor[] }; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-[var(--color-surface-2)] border border-[var(--color-border)] overflow-hidden"
      >
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-[var(--color-border)] sm:hidden" />

        <button onClick={onClose} className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-[var(--color-surface-3)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-cream)] hover:border-[var(--color-gold-soft)] transition-all shadow-lg">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6 pt-8 sm:pt-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-16 h-16 flex-shrink-0">
              <Image src={`/images/${item.image}`} alt={item.name} fill className="object-contain drop-shadow-xl" />
            </div>
            <div>
              <h3 className="text-lg font-[family-name:var(--font-display)] font-semibold text-[var(--color-cream)]">{item.name}</h3>
              <span className="text-sm text-[var(--color-muted)] rtl" dir="rtl">{item.arabic}</span>
            </div>
          </div>

          <p className="text-xs uppercase tracking-[0.15em] text-[var(--color-muted)] mb-3 font-medium">Choose a flavor</p>

          <div className="flex flex-col gap-2">
            {item.flavors.map((flavor) => (
              <button
                key={flavor.name}
                className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl bg-[var(--color-surface-3)]/50 border border-[var(--color-border)] hover:border-[var(--color-gold-soft)] hover:bg-[var(--color-gold-soft)]/5 transition-all duration-300 text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-gold)] opacity-60 group-hover:opacity-100 transition-opacity" />
                  <div>
                    <span className="text-sm font-medium text-[var(--color-cream)]">{flavor.name}</span>
                    <span className="block text-xs text-[var(--color-muted)] rtl" dir="rtl">{flavor.arabic}</span>
                  </div>
                </div>
                <span className="text-base font-[family-name:var(--font-display)] font-bold text-[var(--color-gold)]">{flavor.price}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProductCard({ item, index, onClick }: { item: MenuItem; index: number; onClick?: () => void }) {
  const hasFlavors = item.flavors && item.flavors.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={onClick}
      className="group relative flex flex-col rounded-2xl overflow-hidden h-full cursor-pointer"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[var(--color-surface-2)] to-[var(--color-surface-3)] border border-[var(--color-border)] group-hover:border-[var(--color-gold-soft)] transition-all duration-500" />
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-[var(--color-gold-soft)]/5 to-transparent" />

      <div className="relative aspect-[4/3] p-6 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-gold-glow)]/20 via-transparent to-transparent" />
        {item.images ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-[70%] h-full -mr-8 z-10">
              <Image src={`/images/${item.images[0]}`} alt={item.name} fill className="object-contain drop-shadow-2xl" sizes="(max-width: 480px) 72vw, (max-width: 640px) 52vw, (max-width: 900px) 42vw, (max-width: 1200px) 30vw, 23vw" priority={index < 2} />
            </div>
            <div className="relative w-[60%] h-full -ml-8 z-0 opacity-70 scale-90">
              <Image src={`/images/${item.images[1]}`} alt={item.name} fill className="object-contain drop-shadow-xl" sizes="(max-width: 480px) 72vw, (max-width: 640px) 52vw, (max-width: 900px) 42vw, (max-width: 1200px) 30vw, 23vw" priority={index < 2} />
            </div>
          </div>
        ) : (
          <motion.div
            className="relative w-full h-full"
            whileHover={{ scale: 1.12 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <Image
              src={`/images/${item.image}`}
              alt={item.name}
              fill
              className="object-contain drop-shadow-2xl"
              sizes="(max-width: 480px) 72vw, (max-width: 640px) 52vw, (max-width: 900px) 42vw, (max-width: 1200px) 30vw, 23vw"
              priority={index < 2}
            />
          </motion.div>
        )}

        {hasFlavors && (
          <div className="absolute bottom-2 right-2 z-10 px-2.5 py-1.5 rounded-full bg-[var(--color-gold)]/20 backdrop-blur-sm border border-[var(--color-gold-soft)] text-[10px] font-semibold text-[var(--color-gold)] flex flex-col items-center gap-0 leading-tight">
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 20V10M18 20V4M6 20v-4" /></svg>
              <span>{item.flavors!.length} flavors</span>
            </div>
            <span className="text-[8px] opacity-70" dir="rtl">نكهات</span>
          </div>
        )}
      </div>

      <div className="relative flex flex-col gap-1.5 p-5 pt-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base md:text-lg font-[family-name:var(--font-display)] font-semibold leading-tight text-[var(--color-cream)] group-hover:text-[var(--color-gold-light)] transition-colors duration-300">
            {item.name}
          </h3>
          <span className="text-xl md:text-2xl font-[family-name:var(--font-display)] font-bold text-[var(--color-gold)] tabular-nums leading-none flex-shrink-0">
            {item.price}
          </span>
        </div>
        <span className="text-xs md:text-sm text-[var(--color-muted)] rtl" dir="rtl">
          {item.arabic}
        </span>
      </div>
    </motion.div>
  );
}

function CategoryCarousel({ cat, index: catIndex }: { cat: (typeof categories)[0]; index: number }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
    loop: false,
  });

  const [prevDisabled, setPrevDisabled] = useState(true);
  const [nextDisabled, setNextDisabled] = useState(true);
  const [selectedItem, setSelectedItem] = useState<MenuItem & { flavors: Flavor[] } | null>(null);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback((api: typeof emblaApi) => {
    if (!api) return;
    setPrevDisabled(!api.canScrollPrev());
    setNextDisabled(!api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const handleCardClick = (item: (typeof cat.items)[0]) => {
    if ("flavors" in item && item.flavors) {
      setSelectedItem(item as MenuItem & { flavors: Flavor[] });
    }
  };

  return (
    <>
      <section className="relative" id={`cat-${catIndex}`}>
        <div className="flex items-center gap-3 px-5 md:px-10 mb-3">
          <div className="hidden md:block w-0.5 h-8 rounded-full bg-gradient-to-b from-[var(--color-gold)] to-transparent" />
          <h2 className="text-xl md:text-2xl font-[family-name:var(--font-display)] font-bold tracking-tight text-[var(--color-cream)]">
            {cat.name}
          </h2>
          <span className="text-xs md:text-sm text-[var(--color-muted)] rtl hidden sm:block" dir="rtl">
            {cat.arabic}
          </span>
          {"priceTag" in cat && (
            <span className="ml-auto text-[9px] md:text-[10px] uppercase tracking-[0.15em] text-[var(--color-gold)] bg-[var(--color-gold-soft)] rounded-full px-3 py-1 font-semibold border border-[var(--color-gold-soft)]">
              {cat.priceTag}
            </span>
          )}
        </div>

        <div className="relative">
          <div className="overflow-hidden pl-5 md:pl-10 pr-5 md:pr-10" ref={emblaRef}>
            <div className="embla__container">
              {cat.items.map((item, i) => (
                <div className="embla__slide py-1" key={item.name}>
                  <ProductCard item={item} index={i} onClick={() => handleCardClick(item)} />
                </div>
              ))}
            </div>
          </div>

          <div className="hidden md:block">
            <ArrowButton direction="prev" onClick={scrollPrev} disabled={prevDisabled} />
            <ArrowButton direction="next" onClick={scrollNext} disabled={nextDisabled} />
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedItem && (
          <FlavorModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

function HeroSection() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative pt-28 pb-16 md:pt-36 md:pb-24 px-5 md:px-10 overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] md:w-[900px] md:h-[550px] bg-gradient-radial from-[var(--color-gold-soft)] via-transparent to-transparent opacity-40 pointer-events-none" />

      <div className="relative flex flex-col items-center text-center gap-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-32 h-32 md:w-44 md:h-44 relative"
        >
          <Image src="/images/logoo.png" alt="MUKHMAS" fill className="object-contain" />
        </motion.div>

        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-[family-name:var(--font-display)] font-bold tracking-[0.08em] text-[var(--color-cream)] leading-none"
        >
          MUKHMAS
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.5, ease: "easeOut" }}
          className="text-sm md:text-base uppercase tracking-[0.5em] text-[var(--color-muted)] font-[family-name:var(--font-body)] font-medium"
        >
          Drinks &amp; Sweets
        </motion.p>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [activeCat, setActiveCat] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.id.replace("cat-", ""));
            setActiveCat(idx);
            const pill = document.getElementById(`pill-${idx}`);
            pill?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
          }
        }
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );

    const sections = document.querySelectorAll("[id^='cat-']");
    sections.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const scrollTo = (idx: number) => {
    const el = document.getElementById(`cat-${idx}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-dvh flex flex-col bg-[var(--color-surface)]">
      <header className="sticky top-0 z-50 bg-[var(--color-surface)]/75 backdrop-blur-2xl border-b border-[var(--color-border)]">
        <div className="flex items-center justify-between px-5 md:px-10 h-14 md:h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center gap-2.5"
          >
            <CoffeeLogo />
            <div>
              <h1 className="text-base md:text-lg font-[family-name:var(--font-display)] font-bold tracking-[0.12em] leading-none text-[var(--color-cream)]">
                MUKHMAS
              </h1>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="overflow-x-auto scrollbar-none px-5 md:px-10 pb-3"
        >
          <div className="flex gap-1.5 min-w-max">
            {categories.map((cat, i) => (
              <button
                key={cat.name}
                id={`pill-${i}`}
                onClick={() => scrollTo(i)}
                className={`relative flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap overflow-hidden ${
                  activeCat === i
                    ? "text-[var(--color-surface)] shadow-lg shadow-[var(--color-gold-soft)]/30"
                    : "text-[var(--color-muted)] hover:text-[var(--color-cream)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)]"
                }`}
              >
                {activeCat === i && (
                  <motion.span
                    layoutId="pillBg"
                    className="absolute inset-0 bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)]"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10 text-base leading-none" style={{ filter: activeCat === i ? "none" : "grayscale(0.5)" }}>{cat.emoji}</span>
                <span className="relative z-10">{cat.name}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </header>

      <main className="flex-1 overflow-y-auto scrollbar-thin">
        <HeroSection />

        <div className="space-y-14 md:space-y-20 pb-14 md:pb-20">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <CategoryCarousel cat={cat} index={i} />
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
