import {
  AudioLines,
  BadgeCheck,
  Bird,
  Building2,
  Camera,
  ChartNoAxesCombined,
  CloudRain,
  Coffee,
  Disc3,
  Download,
  Drum,
  Flame,
  Flower2,
  Folder,
  Globe2,
  Guitar,
  Heart,
  Infinity,
  Instagram,
  Link,
  MicVocal,
  Moon,
  Music2,
  Orbit,
  Piano,
  Play,
  Radio,
  Rocket,
  SlidersHorizontal,
  Smile,
  Sparkles,
  Sun,
  Target,
  Telescope,
  TreePine,
  Twitter,
  Video,
  WandSparkles,
  Waves,
  Youtube,
  Zap,
  createElement,
  type IconNode,
} from "lucide";

const icons = {
  analytics: ChartNoAxesCombined,
  audio: AudioLines,
  badge: BadgeCheck,
  bass: Music2,
  camera: Camera,
  calm: Smile,
  classical: Music2,
  cloudRain: CloudRain,
  coffee: Coffee,
  disc: Disc3,
  download: Download,
  dramatic: Sparkles,
  drums: Drum,
  energetic: Flame,
  experimental: WandSparkles,
  fantasy: WandSparkles,
  fast: Zap,
  favorite: Heart,
  flame: Flame,
  flute: Music2,
  folder: Folder,
  flower: Flower2,
  freedom: Bird,
  globe: Globe2,
  guitar: Guitar,
  heart: Heart,
  infinity: Infinity,
  instagram: Instagram,
  jazz: Music2,
  layered: SlidersHorizontal,
  link: Link,
  lofi: Piano,
  love: Heart,
  melody: Music2,
  melancholy: CloudRain,
  microphone: MicVocal,
  minimal: Music2,
  moon: Moon,
  music: Music2,
  nature: TreePine,
  nostalgia: Video,
  ocean: Waves,
  orbit: Orbit,
  orchestral: AudioLines,
  piano: Piano,
  play: Play,
  pop: Music2,
  radio: Radio,
  rebellious: Guitar,
  rocket: Rocket,
  rock: Guitar,
  space: Telescope,
  sparkles: Sparkles,
  steady: Target,
  sun: Sun,
  synth: Radio,
  tiktok: Music2,
  trumpet: Music2,
  twitter: Twitter,
  urban: Building2,
  violin: Music2,
  waves: Waves,
  youtube: Youtube,
  zap: Zap,
} satisfies Record<string, IconNode>;

export type IconName = keyof typeof icons;

export function iconHtml(name: IconName, className = ""): string {
  const classAttr = className ? ` class="${className}"` : "";
  return `<span data-echo-icon="${name}"${classAttr}></span>`;
}

function buildIcon(name: string): SVGElement {
  const node = icons[name as IconName] || icons.music;
  const svg = createElement(node) as SVGElement;
  svg.setAttribute("width", "1em");
  svg.setAttribute("height", "1em");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("lucide-inline");
  return svg;
}

export function upgradeIcons(root: ParentNode = document.body): void {
  root.querySelectorAll<HTMLElement>("[data-echo-icon]").forEach((placeholder) => {
    const name = placeholder.dataset.echoIcon || "music";
    const svg = buildIcon(name);
    svg.classList.add(...placeholder.classList);
    placeholder.replaceWith(svg);
  });
}

export function startIconObserver(): void {
  const style = document.createElement("style");
  style.textContent =
    ".lucide-inline{display:inline-block;vertical-align:-.125em;flex-shrink:0;stroke-width:2}";
  document.head.appendChild(style);

  upgradeIcons();
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement && !node.closest("svg")) {
          upgradeIcons(node);
        }
      });
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}


