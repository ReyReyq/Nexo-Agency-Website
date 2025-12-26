import { useState } from 'react';
import { Check, ExternalLink, Copy } from 'lucide-react';

// Image categories based on research
const imageCategories = {
  "Creative Workspace (Dark)": [
    { url: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1920&q=90", desc: "Dark office with glowing screens" },
    { url: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=1920&q=90", desc: "Moody desk setup with monitor" },
    { url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1920&q=90", desc: "Team collaboration in dark office" },
    { url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920&q=90", desc: "Modern coworking space dark" },
    { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=90", desc: "Minimal desk dark aesthetic" },
    { url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920&q=90", desc: "Tech team working late" },
  ],
  "Designer at Work (Moody)": [
    { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=90", desc: "Creative professional portrait" },
    { url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1920&q=90", desc: "Business professional dark" },
    { url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1920&q=90", desc: "Woman professional dark bg" },
    { url: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1920&q=90", desc: "Team meeting moody lighting" },
    { url: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1920&q=90", desc: "Developer working late" },
    { url: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&q=90", desc: "Creative team collaboration" },
  ],
  "Luxury Product (Dark)": [
    { url: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=1920&q=90", desc: "Luxury watch dark background" },
    { url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1920&q=90", desc: "Product on dark surface" },
    { url: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1920&q=90", desc: "Sneaker dark aesthetic" },
    { url: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1920&q=90", desc: "Headphones dark premium" },
    { url: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1920&q=90", desc: "Perfume bottle dark" },
    { url: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=1920&q=90", desc: "Cosmetics dark background" },
  ],
  "Automotive (Premium Dark)": [
    { url: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920&q=90", desc: "Sports car dark garage" },
    { url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=90", desc: "Luxury car side view" },
    { url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=90", desc: "Porsche dark aesthetic" },
    { url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1920&q=90", desc: "Car detail close-up" },
    { url: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1920&q=90", desc: "BMW dark studio" },
    { url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1920&q=90", desc: "Mercedes dark background" },
  ],
  "Abstract Tech (Dark)": [
    { url: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1920&q=90", desc: "Purple abstract gradient" },
    { url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920&q=90", desc: "Abstract flowing shapes" },
    { url: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1920&q=90", desc: "Purple gradient abstract" },
    { url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1920&q=90", desc: "Colorful gradient mesh" },
    { url: "https://images.unsplash.com/photo-1614851099175-e5b30eb6f696?w=1920&q=90", desc: "Dark abstract waves" },
    { url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1920&q=90", desc: "Geometric abstract dark" },
  ],
  "Technology (Moody)": [
    { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=90", desc: "Circuit board macro dark" },
    { url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920&q=90", desc: "Cybersecurity dark" },
    { url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1920&q=90", desc: "Matrix code dark" },
    { url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=1920&q=90", desc: "Laptop code dark" },
    { url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1920&q=90", desc: "Programming dark screen" },
    { url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1920&q=90", desc: "Code editor dark theme" },
  ],
  "Artistic/Editorial": [
    { url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1920&q=90", desc: "Portrait dramatic lighting" },
    { url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1920&q=90", desc: "Fashion portrait dark" },
    { url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1920&q=90", desc: "Editorial portrait moody" },
    { url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1920&q=90", desc: "Artistic close-up" },
    { url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1920&q=90", desc: "Professional headshot" },
    { url: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=1920&q=90", desc: "Creative portrait dark" },
  ],
  "Hands Creating": [
    { url: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=1920&q=90", desc: "Hands typing keyboard" },
    { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=90", desc: "Designer hands working" },
    { url: "https://images.unsplash.com/photo-1512295767273-ac109ac3acfa?w=1920&q=90", desc: "Hands phone design" },
    { url: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=1920&q=90", desc: "Artist hands sketching" },
    { url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=90", desc: "Hands with tablet" },
    { url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1920&q=90", desc: "Team hands meeting" },
  ],
  "Architecture (Dark)": [
    { url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=90", desc: "Modern building dark sky" },
    { url: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=1920&q=90", desc: "Architecture geometric dark" },
    { url: "https://images.unsplash.com/photo-1518005068251-37900150dfca?w=1920&q=90", desc: "Building facade dark" },
    { url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&q=90", desc: "Skyscraper night" },
    { url: "https://images.unsplash.com/photo-1494522358652-f30e61a60313?w=1920&q=90", desc: "Modern interior dark" },
    { url: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1920&q=90", desc: "Building pattern dark" },
  ],
  "Minimal/Clean": [
    { url: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&q=90", desc: "Gradient minimal blue" },
    { url: "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=1920&q=90", desc: "Gradient minimal pink" },
    { url: "https://images.unsplash.com/photo-1557682260-96773eb01377?w=1920&q=90", desc: "Minimal dark gradient" },
    { url: "https://images.unsplash.com/photo-1557682268-e3955ed5d83f?w=1920&q=90", desc: "Abstract minimal dark" },
    { url: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1920&q=90", desc: "Marble texture dark" },
    { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=90", desc: "Clean minimal surface" },
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
    <div className="min-h-screen bg-gray-950 text-white">
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
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
