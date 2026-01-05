import { useState } from 'react';
import { Check, ExternalLink, Copy } from 'lucide-react';

// Image categories based on research
const imageCategories = {
  "Creative Workspace (Dark)": [
    { url: "/images/gallery/workspace-modern-office.webp", desc: "Dark office with glowing screens" },
    { url: "/images/gallery/workspace-team-desk.webp", desc: "Moody desk setup with monitor" },
    { url: "/images/gallery/workspace-meeting-room.webp", desc: "Team collaboration in dark office" },
    { url: "/images/gallery/workspace-open-plan.webp", desc: "Modern coworking space dark" },
    { url: "/images/gallery/workspace-minimal.webp", desc: "Minimal desk dark aesthetic" },
    { url: "/images/gallery/workspace-laptop-team.webp", desc: "Tech team working late" },
  ],
  "Designer at Work (Moody)": [
    { url: "/images/gallery/portrait-professional-man.webp", desc: "Creative professional portrait" },
    { url: "/images/gallery/portrait-business-man.webp", desc: "Business professional dark" },
    { url: "/images/gallery/portrait-business-woman.webp", desc: "Woman professional dark bg" },
    { url: "/images/gallery/team-office-meeting.webp", desc: "Team meeting moody lighting" },
    { url: "/images/gallery/team-coding-session.webp", desc: "Developer working late" },
    { url: "/images/gallery/team-collaboration-desk.webp", desc: "Creative team collaboration" },
  ],
  "Luxury Product (Dark)": [
    { url: "/images/gallery/product-luxury-watch.webp", desc: "Luxury watch dark background" },
    { url: "/images/gallery/product-minimalist-watch.webp", desc: "Product on dark surface" },
    { url: "/images/gallery/product-sneaker.webp", desc: "Sneaker dark aesthetic" },
    { url: "/images/gallery/product-headphones.webp", desc: "Headphones dark premium" },
    { url: "/images/gallery/product-perfume.webp", desc: "Perfume bottle dark" },
    { url: "/images/gallery/product-cosmetics.webp", desc: "Cosmetics dark background" },
  ],
  "Automotive (Premium Dark)": [
    { url: "/images/gallery/automotive-luxury-car.webp", desc: "Sports car dark garage" },
    { url: "/images/gallery/automotive-sports-car.webp", desc: "Luxury car side view" },
    { url: "/images/gallery/automotive-classic-porsche.webp", desc: "Porsche dark aesthetic" },
    { url: "/images/gallery/automotive-modern-car.webp", desc: "Car detail close-up" },
    { url: "/images/gallery/automotive-bmw.webp", desc: "BMW dark studio" },
    { url: "/images/gallery/automotive-mercedes.webp", desc: "Mercedes dark background" },
  ],
  "Abstract Tech (Dark)": [
    { url: "/images/gallery/abstract-gradient-purple.webp", desc: "Purple abstract gradient" },
    { url: "/images/gallery/abstract-gradient-colorful.webp", desc: "Abstract flowing shapes" },
    { url: "/images/gallery/abstract-gradient-pink.webp", desc: "Purple gradient abstract" },
    { url: "/images/gallery/abstract-gradient-rainbow.webp", desc: "Colorful gradient mesh" },
    { url: "/images/gallery/abstract-3d-shapes.webp", desc: "Dark abstract waves" },
    { url: "/images/gallery/abstract-geometric.webp", desc: "Geometric abstract dark" },
  ],
  "Technology (Moody)": [
    { url: "/images/gallery/tech-circuit-board.webp", desc: "Circuit board macro dark" },
    { url: "/images/gallery/tech-cyber-security.webp", desc: "Cybersecurity dark" },
    { url: "/images/gallery/tech-matrix-code.webp", desc: "Matrix code dark" },
    { url: "/images/gallery/tech-laptop-code.webp", desc: "Laptop code dark" },
    { url: "/images/gallery/tech-programming.webp", desc: "Programming dark screen" },
    { url: "/images/gallery/tech-code-screen.webp", desc: "Code editor dark theme" },
  ],
  "Artistic/Editorial": [
    { url: "/images/gallery/editorial-man-portrait.webp", desc: "Portrait dramatic lighting" },
    { url: "/images/gallery/editorial-woman-fashion.webp", desc: "Fashion portrait dark" },
    { url: "/images/gallery/editorial-woman-casual.webp", desc: "Editorial portrait moody" },
    { url: "/images/gallery/editorial-woman-beauty.webp", desc: "Artistic close-up" },
    { url: "/images/gallery/editorial-woman-smile.webp", desc: "Professional headshot" },
    { url: "/images/gallery/editorial-woman-laughing.webp", desc: "Creative portrait dark" },
  ],
  "Hands Creating": [
    { url: "/images/gallery/hands-pottery.webp", desc: "Hands typing keyboard" },
    { url: "/images/gallery/hands-painting.webp", desc: "Designer hands working" },
    { url: "/images/gallery/hands-typing.webp", desc: "Hands phone design" },
    { url: "/images/gallery/hands-design-work.webp", desc: "Artist hands sketching" },
    { url: "/images/gallery/hands-ecommerce.webp", desc: "Hands with tablet" },
    { url: "/images/gallery/hands-teamwork.webp", desc: "Team hands meeting" },
  ],
  "Architecture (Dark)": [
    { url: "/images/gallery/architecture-skyscraper.webp", desc: "Modern building dark sky" },
    { url: "/images/gallery/architecture-modern-building.webp", desc: "Architecture geometric dark" },
    { url: "/images/gallery/architecture-interior.webp", desc: "Building facade dark" },
    { url: "/images/gallery/architecture-apartments.webp", desc: "Skyscraper night" },
    { url: "/images/gallery/architecture-glass-building.webp", desc: "Modern interior dark" },
    { url: "/images/gallery/architecture-white-building.webp", desc: "Building pattern dark" },
  ],
  "Minimal/Clean": [
    { url: "/images/gallery/minimal-gradient-blue.webp", desc: "Gradient minimal blue" },
    { url: "/images/gallery/minimal-gradient-pink-blue.webp", desc: "Gradient minimal pink" },
    { url: "/images/gallery/minimal-gradient-purple-blue.webp", desc: "Minimal dark gradient" },
    { url: "/images/gallery/minimal-gradient-sunset.webp", desc: "Abstract minimal dark" },
    { url: "/images/gallery/minimal-abstract-marble.webp", desc: "Marble texture dark" },
    { url: "/images/gallery/portrait-professional-man.webp", desc: "Clean minimal surface" },
  ],
};

function ImageCard({ url, desc, isSelected, onSelect }: {
  url: string;
  desc: string;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copyUrl = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`relative group cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
        isSelected ? 'border-pink-500 ring-2 ring-pink-500/50' : 'border-transparent hover:border-gray-600'
      }`}
      onClick={onSelect}
    >
      <div className="aspect-video bg-gray-900">
        <img
          src={url}
          alt={desc}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
          width={640}
          height={360}
        />
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
          <Check className="w-5 h-5 text-white" />
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
        <button
          onClick={copyUrl}
          className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
          title="Copy URL"
        >
          {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-white" />}
        </button>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
          title="Open full size"
        >
          <ExternalLink className="w-5 h-5 text-white" />
        </a>
      </div>

      {/* Description */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
        <p className="text-white text-sm truncate">{desc}</p>
      </div>
    </div>
  );
}

export default function ImagePicker() {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const toggleImage = (url: string) => {
    setSelectedImages(prev =>
      prev.includes(url)
        ? prev.filter(u => u !== url)
        : [...prev, url]
    );
  };

  const copySelected = () => {
    const text = selectedImages.join('\n');
    navigator.clipboard.writeText(text);
  };

  const categories = Object.keys(imageCategories);
  const displayCategories = activeCategory
    ? { [activeCategory]: imageCategories[activeCategory as keyof typeof imageCategories] }
    : imageCategories;

  return (
    <main id="main-content" className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
                Image Picker
              </h1>
              <p className="text-gray-400 text-sm">Select images for your hero section & preloader</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400">
                {selectedImages.length} selected
              </span>
              {selectedImages.length > 0 && (
                <button
                  onClick={copySelected}
                  className="px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy URLs
                </button>
              )}
            </div>
          </div>

          {/* Category filters */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                activeCategory === null
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Image Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {Object.entries(displayCategories).map(([category, images]) => (
          <div key={category} className="mb-12">
            <h2 className="text-xl font-semibold mb-4 text-gray-200">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((img, idx) => (
                <ImageCard
                  key={idx}
                  url={img.url}
                  desc={img.desc}
                  isSelected={selectedImages.includes(img.url)}
                  onSelect={() => toggleImage(img.url)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Images Preview */}
      {selectedImages.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              <span className="text-gray-400 text-sm whitespace-nowrap">Selected:</span>
              {selectedImages.map((url, idx) => (
                <div
                  key={idx}
                  className="w-20 h-12 flex-shrink-0 rounded-lg overflow-hidden border border-gray-700 cursor-pointer hover:border-red-500 transition-colors"
                  onClick={() => toggleImage(url)}
                  title="Click to remove"
                >
                  <img
                    src={url}
                    alt="Selected thumbnail"
                    loading="lazy"
                    decoding="async"
                    width={80}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
