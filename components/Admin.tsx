
import React, { useState, useEffect } from 'react';
import { Cat, Testimonial, Service, GalleryItem } from '../types';
import { Trash2, Edit, Plus, X, Save, Image as ImageIcon, LogOut, ArrowLeft, Download, Upload, Loader2, Cloud, CloudOff, HardDrive } from 'lucide-react';
import { Modal } from './Modal';
import { isGitHubConfigured, flushPendingSaves } from '../utils/dataManager';
import { calculateAge } from '../utils/ageCalculator';

interface AdminProps {
  cats: Cat[];
  setCats: React.Dispatch<React.SetStateAction<Cat[]>>;
  testimonials: Testimonial[];
  setTestimonials: React.Dispatch<React.SetStateAction<Testimonial[]>>;
  services: Service[];
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  aboutGallery: GalleryItem[];
  setAboutGallery: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  facilityGallery: GalleryItem[];
  setFacilityGallery: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  onBack: () => void;
}

type Tab = 'cats' | 'testimonials' | 'services' | 'galleries';

const BREED_OPTIONS = [
  'Domestic Long Hair',
  'Domestic Short Hair',
  'British Short Hair',
  'British Long Hair',
  'Other'
];

const Admin: React.FC<AdminProps> = ({ cats, setCats, testimonials, setTestimonials, services, setServices, aboutGallery, setAboutGallery, facilityGallery, setFacilityGallery, onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('cats');
  const [githubConnected, setGithubConnected] = useState<boolean | null>(null);
  
  // Cat Form State
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Cat | null>(null);
  const [catForm, setCatForm] = useState<Partial<Cat>>({
    name: '', dateOfBirth: '', breed: '', gender: 'Male', image: '', personality: []
  });
  const [catPersonalityInput, setCatPersonalityInput] = useState('');
  const [uploadingCatImage, setUploadingCatImage] = useState(false);
  const [breedSelection, setBreedSelection] = useState<string>('Domestic Short Hair');
  const [customBreed, setCustomBreed] = useState<string>('');

  // Testimonial Form State
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [testimonialForm, setTestimonialForm] = useState<Partial<Testimonial>>({
    name: '', role: '', feedback: '', image: ''
  });
  const [uploadingTestimonialImage, setUploadingTestimonialImage] = useState(false);

  // Service Form State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState<Partial<Service>>({
      title: '', price: '', description: '', icon: 'bed', images: []
  });
  const [serviceImagesInput, setServiceImagesInput] = useState('');
  const [uploadingServiceImage, setUploadingServiceImage] = useState(false);

  // Gallery Modal State
  const [isAboutGalleryModalOpen, setIsAboutGalleryModalOpen] = useState(false);
  const [isFacilityGalleryModalOpen, setIsFacilityGalleryModalOpen] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [galleryForm, setGalleryForm] = useState<Partial<GalleryItem>>({ image: '', caption: '' });
  const [uploadingGalleryImage, setUploadingGalleryImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // ImgBB API Configuration
  const IMGBB_API_KEY = 'a087caae14a41f654e82a8b975b9d157'; // Replace with your API key from https://api.imgbb.com/

  // Image Upload Handler
  const uploadImage = async (file: File, setUploading: (val: boolean) => void): Promise<string | null> => {
    if (!file) return null;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return null;
    }

    // Validate file size (max 32MB for ImgBB)
    if (file.size > 32 * 1024 * 1024) {
      alert('Image size must be less than 32MB');
      return null;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        return data.data.url;
      } else {
        alert('Upload failed: ' + (data.error?.message || 'Unknown error'));
        return null;
      }
    } catch (error) {
      alert('Upload failed. Please check your internet connection.');
      console.error('Upload error:', error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Export/Import functionality
  const exportData = () => {
    const data = {
      cats,
      testimonials,
      services,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cats-and-cozy-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.cats) setCats(data.cats);
        if (data.testimonials) setTestimonials(data.testimonials);
        if (data.services) setServices(data.services);
        alert('Data imported successfully!');
      } catch (error) {
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  // Check GitHub connection status
  useEffect(() => {
    if (isAuthenticated) {
      isGitHubConfigured().then(setGithubConnected);
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password. Try "admin"');
    }
  };

  // --- CAT CRUD ---
  const openCatModal = (cat?: Cat) => {
    if (cat) {
      setEditingCat(cat);
      setCatForm(cat);
      setCatPersonalityInput(cat.personality.join(', '));
      // Check if breed is in predefined list
      if (BREED_OPTIONS.includes(cat.breed)) {
        setBreedSelection(cat.breed);
        setCustomBreed('');
      } else {
        setBreedSelection('Other');
        setCustomBreed(cat.breed);
      }
    } else {
      setEditingCat(null);
      setCatForm({ name: '', dateOfBirth: '', breed: '', gender: 'Male', image: '', personality: [] });
      setCatPersonalityInput('');
      setBreedSelection('Domestic Short Hair');
      setCustomBreed('');
    }
    setIsCatModalOpen(true);
  };

  const saveCat = (e: React.FormEvent) => {
    e.preventDefault();
    const personalityArray = catPersonalityInput.split(',').map(s => s.trim()).filter(s => s);
    const finalBreed = breedSelection === 'Other' ? customBreed : breedSelection;
    const newCatData = { ...catForm, breed: finalBreed, personality: personalityArray } as Cat;

    if (editingCat) {
      setCats(cats.map(c => c.id === editingCat.id ? { ...newCatData, id: c.id } : c));
    } else {
      setCats([...cats, { ...newCatData, id: Date.now() }]);
    }
    setIsCatModalOpen(false);
  };

  const deleteCat = (id: number) => {
    if (confirm('Are you sure you want to delete this cat?')) {
      setCats(cats.filter(c => c.id !== id));
    }
  };

  // --- TESTIMONIAL CRUD ---
  const openTestimonialModal = (t?: Testimonial) => {
    if (t) {
      setEditingTestimonial(t);
      setTestimonialForm(t);
    } else {
      setEditingTestimonial(null);
      setTestimonialForm({ name: '', role: '', feedback: '', image: '' });
    }
    setIsTestimonialModalOpen(true);
  };

  const saveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    const newTData = { ...testimonialForm } as Testimonial;

    if (editingTestimonial) {
      setTestimonials(testimonials.map(t => t.id === editingTestimonial.id ? { ...newTData, id: t.id } : t));
    } else {
      setTestimonials([...testimonials, { ...newTData, id: Date.now() }]);
    }
    setIsTestimonialModalOpen(false);
  };

  const deleteTestimonial = (id: number) => {
    if (confirm('Delete this testimonial?')) {
      setTestimonials(testimonials.filter(t => t.id !== id));
    }
  };

  // --- SERVICE CRUD ---
  const openServiceModal = (s?: Service) => {
      if (s) {
          setEditingService(s);
          setServiceForm(s);
          setServiceImagesInput(s.images ? s.images.join('\n') : '');
      } else {
          // Generally we don't add new services in this simple admin, but edit existing ones
          setEditingService(null);
          setServiceForm({ title: '', price: '', description: '', icon: 'bed', images: [] });
          setServiceImagesInput('');
      }
      setIsServiceModalOpen(true);
  };

  const saveService = (e: React.FormEvent) => {
      e.preventDefault();
      const imagesArray = serviceImagesInput.split('\n').map(s => s.trim()).filter(s => s);
      const newServiceData = { ...serviceForm, images: imagesArray } as Service;
      
      if (editingService) {
          setServices(services.map(s => s.id === editingService.id ? { ...newServiceData, id: s.id } : s));
      } else {
          setServices([...services, { ...newServiceData, id: Date.now() }]);
      }
      setIsServiceModalOpen(false);
  };

  // --- GALLERY CRUD ---
  const openGalleryModal = (type: 'about' | 'facility', item?: GalleryItem) => {
    if (item) {
      setEditingGalleryItem(item);
      setGalleryForm(item);
    } else {
      setEditingGalleryItem(null);
      setGalleryForm({ image: '', caption: '' });
    }
    if (type === 'about') {
      setIsAboutGalleryModalOpen(true);
    } else {
      setIsFacilityGalleryModalOpen(true);
    }
  };

  const saveGalleryItem = (e: React.FormEvent, type: 'about' | 'facility') => {
    e.preventDefault();
    const newItem = { ...galleryForm } as GalleryItem;

    if (type === 'about') {
      if (editingGalleryItem) {
        setAboutGallery(aboutGallery.map(item => item.id === editingGalleryItem.id ? { ...newItem, id: item.id } : item));
      } else {
        setAboutGallery([...aboutGallery, { ...newItem, id: Date.now() }]);
      }
      setIsAboutGalleryModalOpen(false);
    } else {
      if (editingGalleryItem) {
        setFacilityGallery(facilityGallery.map(item => item.id === editingGalleryItem.id ? { ...newItem, id: item.id } : item));
      } else {
        setFacilityGallery([...facilityGallery, { ...newItem, id: Date.now() }]);
      }
      setIsFacilityGalleryModalOpen(false);
    }
  };

  const deleteGalleryItem = (id: number, type: 'about' | 'facility') => {
    if (confirm('Delete this image?')) {
      if (type === 'about') {
        setAboutGallery(aboutGallery.filter(item => item.id !== id));
      } else {
        setFacilityGallery(facilityGallery.filter(item => item.id !== id));
      }
    }
  };

  // Manual save function
  const handleManualSave = async () => {
    setIsSaving(true);
    try {
      await flushPendingSaves();
      alert('All changes saved to GitHub successfully!');
    } catch (error) {
      alert('Error saving to GitHub. Changes are saved locally.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-cat-black flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl w-full max-w-md border-4 border-cat-blue shadow-[8px_8px_0px_0px_#8CE4FF]">
          <h2 className="text-3xl font-black mb-6 text-center uppercase">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-bold mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-3 border-2 border-cat-black rounded-xl outline-none focus:border-cat-blue"
                placeholder="Enter password..."
              />
            </div>
            <button className="w-full bg-cat-black text-white font-bold py-3 rounded-xl hover:bg-gray-800">
              Unlock Panel
            </button>
            <button type="button" onClick={onBack} className="w-full text-center text-gray-500 hover:text-black font-bold text-sm">
              Back to Website
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b-2 border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft />
            </button>
            <div>
              <h1 className="text-2xl font-black uppercase">Admin Dashboard</h1>
              {githubConnected !== null && (
                <div className="flex items-center gap-2 mt-1">
                  {githubConnected ? (
                    <>
                      <Cloud size={14} className="text-green-500" />
                      <span className="text-xs font-bold text-green-600">GitHub Connected</span>
                    </>
                  ) : (
                    <>
                      <HardDrive size={14} className="text-orange-500" />
                      <span className="text-xs font-bold text-orange-600">Local Storage Only</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleManualSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-green-500 text-white font-bold hover:bg-green-600 disabled:bg-gray-400 px-4 py-2 rounded-xl transition-colors"
              title="Save all changes to GitHub now"
            >
              {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              <span className="hidden md:inline">{isSaving ? 'Saving...' : 'Save Now'}</span>
            </button>
            <button 
              onClick={exportData}
              className="flex items-center gap-2 bg-cat-blue text-cat-black font-bold hover:bg-cat-yellow px-4 py-2 rounded-xl transition-colors"
              title="Export all data as JSON backup"
            >
              <Download size={20} />
              <span className="hidden md:inline">Export</span>
            </button>
            <label className="flex items-center gap-2 bg-cat-yellow text-cat-black font-bold hover:bg-cat-orange px-4 py-2 rounded-xl transition-colors cursor-pointer">
              <Upload size={20} />
              <span className="hidden md:inline">Import</span>
              <input 
                type="file" 
                accept=".json" 
                onChange={importData}
                className="hidden"
              />
            </label>
            <button onClick={() => setIsAuthenticated(false)} className="flex items-center gap-2 text-red-500 font-bold hover:bg-red-50 px-4 py-2 rounded-xl">
              <LogOut size={20} />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex justify-center gap-4 md:gap-8 mt-2 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab('cats')}
            className={`pb-4 px-4 font-bold border-b-4 transition-colors whitespace-nowrap ${activeTab === 'cats' ? 'border-cat-blue text-cat-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            Manage Cats
          </button>
          <button 
            onClick={() => setActiveTab('testimonials')}
            className={`pb-4 px-4 font-bold border-b-4 transition-colors whitespace-nowrap ${activeTab === 'testimonials' ? 'border-cat-orange text-cat-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            Manage Testimonials
          </button>
           <button 
            onClick={() => setActiveTab('services')}
            className={`pb-4 px-4 font-bold border-b-4 transition-colors whitespace-nowrap ${activeTab === 'services' ? 'border-cat-red text-cat-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            Manage Services
          </button>
          <button 
            onClick={() => setActiveTab('galleries')}
            className={`pb-4 px-4 font-bold border-b-4 transition-colors whitespace-nowrap ${activeTab === 'galleries' ? 'border-cat-yellow text-cat-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            Manage Galleries
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* --- CATS TAB --- */}
        {activeTab === 'cats' && (
          <div>
             <div className="flex justify-between items-center mb-8">
               <h2 className="text-3xl font-black">Adoption Gallery</h2>
               <button 
                onClick={() => openCatModal()}
                className="bg-cat-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-cat-blue hover:text-black transition-colors"
               >
                 <Plus /> Add Cat
               </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cats.map(cat => (
                  <div key={cat.id} className="bg-white p-4 rounded-2xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="h-48 rounded-xl overflow-hidden mb-4 relative group">
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                         <button onClick={() => openCatModal(cat)} className="p-2 bg-white rounded-full hover:bg-cat-yellow"><Edit size={16} /></button>
                         <button onClick={() => deleteCat(cat.id)} className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    <h3 className="text-xl font-black">{cat.name}</h3>
                    <p className="text-gray-500 text-sm">{cat.breed} • {calculateAge(cat.dateOfBirth)}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {cat.personality.map((p, i) => (
                        <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">{p}</span>
                      ))}
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* --- TESTIMONIALS TAB --- */}
        {activeTab === 'testimonials' && (
          <div>
             <div className="flex justify-between items-center mb-8">
               <h2 className="text-3xl font-black">Testimonials</h2>
               <button 
                onClick={() => openTestimonialModal()}
                className="bg-cat-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-cat-orange hover:text-black transition-colors"
               >
                 <Plus /> Add Testimonial
               </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map(t => (
                  <div key={t.id} className="bg-white p-6 rounded-2xl border-2 border-gray-200 relative group">
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => openTestimonialModal(t)} className="p-2 bg-gray-100 rounded-full hover:bg-cat-yellow"><Edit size={16} /></button>
                         <button onClick={() => deleteTestimonial(t.id)} className="p-2 bg-gray-100 rounded-full text-red-500 hover:bg-red-50"><Trash2 size={16} /></button>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover border border-gray-300"/>
                      <div>
                        <h4 className="font-bold">{t.name}</h4>
                        <p className="text-sm text-gray-500">{t.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 italic">"{t.feedback}"</p>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* --- SERVICES TAB --- */}
        {activeTab === 'services' && (
            <div>
                 <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-black">Manage Services</h2>
                    <p className="text-gray-500 font-bold text-sm">Update prices and gallery images</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {services.map(s => (
                         <div key={s.id} className="bg-white p-6 rounded-2xl border-2 border-gray-200">
                             <div className="flex justify-between items-start mb-4">
                                <h3 className="text-2xl font-black">{s.title}</h3>
                                <button onClick={() => openServiceModal(s)} className="p-2 bg-gray-100 rounded-full hover:bg-cat-blue"><Edit size={18} /></button>
                             </div>
                             <div className="text-cat-red font-bold text-xl mb-2">{s.price}</div>
                             <p className="text-gray-600 mb-4 text-sm">{s.description}</p>
                             <div className="bg-gray-100 p-3 rounded-xl">
                                 <span className="text-xs font-bold uppercase text-gray-400 block mb-1">Gallery Images</span>
                                 <div className="flex -space-x-2 overflow-hidden">
                                     {s.images && s.images.length > 0 ? s.images.slice(0, 4).map((img, i) => (
                                         <img key={i} src={img} className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                                     )) : <span className="text-xs text-gray-400 italic">No images</span>}
                                 </div>
                             </div>
                         </div>
                     ))}
                 </div>
            </div>
        )}

        {/* --- GALLERIES TAB --- */}
        {activeTab === 'galleries' && (
          <div className="space-y-12">
            {/* About Us Gallery */}
            <div>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-black">About Us Gallery</h2>
                  <p className="text-gray-500 font-bold text-sm">Scrolling gallery on homepage</p>
                </div>
                <button 
                  onClick={() => openGalleryModal('about')}
                  className="bg-cat-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-cat-yellow hover:text-black transition-colors"
                >
                  <Plus /> Add Image
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {aboutGallery.map(item => (
                  <div key={item.id} className="relative group bg-white rounded-xl overflow-hidden border-2 border-gray-200 hover:border-cat-black transition-colors">
                    <div className="aspect-square">
                      <img src={item.image} alt="Gallery" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button onClick={() => openGalleryModal('about', item)} className="p-2 bg-white rounded-full hover:bg-cat-yellow"><Edit size={16} /></button>
                      <button onClick={() => deleteGalleryItem(item.id, 'about')} className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Facility Gallery */}
            <div>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-black">Facility Gallery</h2>
                  <p className="text-gray-500 font-bold text-sm">Showcase your facility with captions</p>
                </div>
                <button 
                  onClick={() => openGalleryModal('facility')}
                  className="bg-cat-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-cat-orange hover:text-black transition-colors"
                >
                  <Plus /> Add Image
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {facilityGallery.map(item => (
                  <div key={item.id} className="relative group bg-white rounded-xl overflow-hidden border-2 border-gray-200 hover:border-cat-black transition-colors">
                    <div className="h-64">
                      <img src={item.image} alt={item.caption} className="w-full h-full object-cover" />
                    </div>
                    {item.caption && (
                      <div className="p-4 bg-white">
                        <p className="font-bold text-sm">{item.caption}</p>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openGalleryModal('facility', item)} className="p-2 bg-white rounded-full hover:bg-cat-yellow shadow-lg"><Edit size={16} /></button>
                      <button onClick={() => deleteGalleryItem(item.id, 'facility')} className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50 shadow-lg"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- CAT MODAL --- */}
      <Modal
        isOpen={isCatModalOpen}
        onClose={() => setIsCatModalOpen(false)}
        title={editingCat ? "Edit Cat" : "Add New Cat"}
      >
        <form onSubmit={saveCat} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold uppercase mb-1">Name</label>
              <input required value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})} className="w-full p-3 border-2 border-gray-200 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase mb-1">Date of Birth</label>
              <input 
                required 
                type="date" 
                value={catForm.dateOfBirth} 
                onChange={e => setCatForm({...catForm, dateOfBirth: e.target.value})} 
                className="w-full p-3 border-2 border-gray-200 rounded-xl" 
              />
              {catForm.dateOfBirth && (
                <p className="text-xs text-gray-500 mt-1">Age: {calculateAge(catForm.dateOfBirth)}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-bold uppercase mb-1">Breed</label>
              <select 
                value={breedSelection} 
                onChange={e => setBreedSelection(e.target.value)} 
                className="w-full p-3 border-2 border-gray-200 rounded-xl bg-white mb-2"
              >
                {BREED_OPTIONS.map(breed => (
                  <option key={breed} value={breed}>{breed}</option>
                ))}
              </select>
              {breedSelection === 'Other' && (
                <input 
                  required
                  value={customBreed} 
                  onChange={e => setCustomBreed(e.target.value)} 
                  className="w-full p-3 border-2 border-gray-200 rounded-xl" 
                  placeholder="Enter breed name..."
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-bold uppercase mb-1">Gender</label>
              <select value={catForm.gender} onChange={e => setCatForm({...catForm, gender: e.target.value as 'Male' | 'Female'})} className="w-full p-3 border-2 border-gray-200 rounded-xl bg-white">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold uppercase mb-1">Image</label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input 
                  value={catForm.image} 
                  onChange={e => setCatForm({...catForm, image: e.target.value})} 
                  className="flex-1 p-3 border-2 border-gray-200 rounded-xl" 
                  placeholder="Paste URL or upload below..." 
                />
                {catForm.image && (
                  <button
                    type="button"
                    onClick={() => setCatForm({...catForm, image: ''})}
                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl border-2 border-gray-200"
                  >
                    Clear
                  </button>
                )}
              </div>
              
              <label className="block">
                <div className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${uploadingCatImage ? 'border-cat-blue bg-blue-50' : 'border-gray-300 hover:border-cat-black hover:bg-gray-50'}`}>
                  {uploadingCatImage ? (
                    <div className="flex items-center justify-center gap-2 text-cat-blue">
                      <Loader2 className="animate-spin" size={20} />
                      <span className="font-bold">Uploading...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload size={24} className="text-gray-400" />
                      <span className="font-bold text-sm">Click to upload image</span>
                      <span className="text-xs text-gray-500">or drag and drop</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingCatImage}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = await uploadImage(file, setUploadingCatImage);
                      if (url) setCatForm({...catForm, image: url});
                    }
                    e.target.value = '';
                  }}
                />
              </label>

              {catForm.image && (
                <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-gray-200">
                  <img src={catForm.image} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                    ✓ Ready
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold uppercase mb-1">Personality (comma separated)</label>
            <input value={catPersonalityInput} onChange={e => setCatPersonalityInput(e.target.value)} className="w-full p-3 border-2 border-gray-200 rounded-xl" placeholder="Playful, Calm, Sweet" />
          </div>
          <button className="w-full bg-cat-black text-white font-bold py-4 rounded-xl mt-4 hover:bg-gray-800">
            SAVE CAT
          </button>
        </form>
      </Modal>

      {/* --- TESTIMONIAL MODAL --- */}
      <Modal
        isOpen={isTestimonialModalOpen}
        onClose={() => setIsTestimonialModalOpen(false)}
        title={editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}
      >
        <form onSubmit={saveTestimonial} className="space-y-4">
           <div>
              <label className="block text-sm font-bold uppercase mb-1">Name</label>
              <input required value={testimonialForm.name} onChange={e => setTestimonialForm({...testimonialForm, name: e.target.value})} className="w-full p-3 border-2 border-gray-200 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase mb-1">Role</label>
              <input required value={testimonialForm.role} onChange={e => setTestimonialForm({...testimonialForm, role: e.target.value})} className="w-full p-3 border-2 border-gray-200 rounded-xl" placeholder="Cat Mom" />
            </div>
             <div>
            <label className="block text-sm font-bold uppercase mb-1">Image</label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input 
                  value={testimonialForm.image} 
                  onChange={e => setTestimonialForm({...testimonialForm, image: e.target.value})} 
                  className="flex-1 p-3 border-2 border-gray-200 rounded-xl" 
                  placeholder="Paste URL or upload below..." 
                />
                {testimonialForm.image && (
                  <button
                    type="button"
                    onClick={() => setTestimonialForm({...testimonialForm, image: ''})}
                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl border-2 border-gray-200"
                  >
                    Clear
                  </button>
                )}
              </div>
              
              <label className="block">
                <div className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${uploadingTestimonialImage ? 'border-cat-blue bg-blue-50' : 'border-gray-300 hover:border-cat-black hover:bg-gray-50'}`}>
                  {uploadingTestimonialImage ? (
                    <div className="flex items-center justify-center gap-2 text-cat-blue">
                      <Loader2 className="animate-spin" size={20} />
                      <span className="font-bold">Uploading...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload size={24} className="text-gray-400" />
                      <span className="font-bold text-sm">Click to upload image</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingTestimonialImage}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = await uploadImage(file, setUploadingTestimonialImage);
                      if (url) setTestimonialForm({...testimonialForm, image: url});
                    }
                    e.target.value = '';
                  }}
                />
              </label>

              {testimonialForm.image && (
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 mx-auto">
                  <img src={testimonialForm.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold uppercase mb-1">Feedback</label>
            <textarea required value={testimonialForm.feedback} onChange={e => setTestimonialForm({...testimonialForm, feedback: e.target.value})} className="w-full p-3 border-2 border-gray-200 rounded-xl h-24" />
          </div>
          <button className="w-full bg-cat-black text-white font-bold py-4 rounded-xl mt-4 hover:bg-gray-800">
            SAVE TESTIMONIAL
          </button>
        </form>
      </Modal>

      {/* --- SERVICE MODAL --- */}
      <Modal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        title="Edit Service"
      >
          <form onSubmit={saveService} className="space-y-4">
              <div>
                  <label className="block text-sm font-bold uppercase mb-1">Service Title</label>
                  <input required value={serviceForm.title} onChange={e => setServiceForm({...serviceForm, title: e.target.value})} className="w-full p-3 border-2 border-gray-200 rounded-xl" />
              </div>
              <div>
                  <label className="block text-sm font-bold uppercase mb-1">Price</label>
                  <input required value={serviceForm.price} onChange={e => setServiceForm({...serviceForm, price: e.target.value})} className="w-full p-3 border-2 border-gray-200 rounded-xl" />
              </div>
              <div>
                  <label className="block text-sm font-bold uppercase mb-1">Description</label>
                  <textarea required value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} className="w-full p-3 border-2 border-gray-200 rounded-xl h-24" />
              </div>
              <div>
                  <label className="block text-sm font-bold uppercase mb-1">Gallery Images</label>
                  <div className="space-y-2">
                    <label className="block">
                      <div className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${uploadingServiceImage ? 'border-cat-blue bg-blue-50' : 'border-gray-300 hover:border-cat-black hover:bg-gray-50'}`}>
                        {uploadingServiceImage ? (
                          <div className="flex items-center justify-center gap-2 text-cat-blue">
                            <Loader2 className="animate-spin" size={20} />
                            <span className="font-bold">Uploading...</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <Upload size={24} className="text-gray-400" />
                            <span className="font-bold text-sm">Click to add gallery image</span>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingServiceImage}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await uploadImage(file, setUploadingServiceImage);
                            if (url) {
                              const currentUrls = serviceImagesInput.trim() ? serviceImagesInput.split('\n') : [];
                              setServiceImagesInput([...currentUrls, url].join('\n'));
                            }
                          }
                          e.target.value = '';
                        }}
                      />
                    </label>

                    <textarea 
                      value={serviceImagesInput} 
                      onChange={e => setServiceImagesInput(e.target.value)} 
                      className="w-full p-3 border-2 border-gray-200 rounded-xl h-24 font-mono text-xs" 
                      placeholder="Or paste URLs (one per line)"
                    />

                    {serviceImagesInput && (
                      <div className="grid grid-cols-3 gap-2">
                        {serviceImagesInput.split('\n').filter(url => url.trim()).map((url, idx) => (
                          <div key={idx} className="relative group">
                            <img src={url.trim()} alt={`Gallery ${idx + 1}`} className="w-full h-20 object-cover rounded border-2 border-gray-200" />
                            <button
                              type="button"
                              onClick={() => {
                                const urls = serviceImagesInput.split('\n').filter((u, i) => i !== idx);
                                setServiceImagesInput(urls.join('\n'));
                              }}
                              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
              </div>
              <button className="w-full bg-cat-black text-white font-bold py-4 rounded-xl mt-4 hover:bg-gray-800">
                UPDATE SERVICE
              </button>
          </form>
      </Modal>

      {/* --- ABOUT GALLERY MODAL --- */}
      <Modal
        isOpen={isAboutGalleryModalOpen}
        onClose={() => setIsAboutGalleryModalOpen(false)}
        title={editingGalleryItem ? "Edit Gallery Image" : "Add Gallery Image"}
      >
        <form onSubmit={(e) => saveGalleryItem(e, 'about')} className="space-y-4">
          <div>
            <label className="block text-sm font-bold uppercase mb-1">Image</label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input 
                  value={galleryForm.image} 
                  onChange={e => setGalleryForm({...galleryForm, image: e.target.value})} 
                  className="flex-1 p-3 border-2 border-gray-200 rounded-xl" 
                  placeholder="Paste URL or upload below..." 
                />
                {galleryForm.image && (
                  <button
                    type="button"
                    onClick={() => setGalleryForm({...galleryForm, image: ''})}
                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl border-2 border-gray-200"
                  >
                    Clear
                  </button>
                )}
              </div>
              
              <label className="block">
                <div className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${uploadingGalleryImage ? 'border-cat-blue bg-blue-50' : 'border-gray-300 hover:border-cat-black hover:bg-gray-50'}`}>
                  {uploadingGalleryImage ? (
                    <div className="flex items-center justify-center gap-2 text-cat-blue">
                      <Loader2 className="animate-spin" size={20} />
                      <span className="font-bold">Uploading...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload size={24} className="text-gray-400" />
                      <span className="font-bold text-sm">Click to upload image</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingGalleryImage}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = await uploadImage(file, setUploadingGalleryImage);
                      if (url) setGalleryForm({...galleryForm, image: url});
                    }
                    e.target.value = '';
                  }}
                />
              </label>

              {galleryForm.image && (
                <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-gray-200">
                  <img src={galleryForm.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
          <button className="w-full bg-cat-black text-white font-bold py-4 rounded-xl mt-4 hover:bg-gray-800">
            SAVE IMAGE
          </button>
        </form>
      </Modal>

      {/* --- FACILITY GALLERY MODAL --- */}
      <Modal
        isOpen={isFacilityGalleryModalOpen}
        onClose={() => setIsFacilityGalleryModalOpen(false)}
        title={editingGalleryItem ? "Edit Facility Image" : "Add Facility Image"}
      >
        <form onSubmit={(e) => saveGalleryItem(e, 'facility')} className="space-y-4">
          <div>
            <label className="block text-sm font-bold uppercase mb-1">Image</label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input 
                  value={galleryForm.image} 
                  onChange={e => setGalleryForm({...galleryForm, image: e.target.value})} 
                  className="flex-1 p-3 border-2 border-gray-200 rounded-xl" 
                  placeholder="Paste URL or upload below..." 
                />
                {galleryForm.image && (
                  <button
                    type="button"
                    onClick={() => setGalleryForm({...galleryForm, image: ''})}
                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl border-2 border-gray-200"
                  >
                    Clear
                  </button>
                )}
              </div>
              
              <label className="block">
                <div className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${uploadingGalleryImage ? 'border-cat-blue bg-blue-50' : 'border-gray-300 hover:border-cat-black hover:bg-gray-50'}`}>
                  {uploadingGalleryImage ? (
                    <div className="flex items-center justify-center gap-2 text-cat-blue">
                      <Loader2 className="animate-spin" size={20} />
                      <span className="font-bold">Uploading...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload size={24} className="text-gray-400" />
                      <span className="font-bold text-sm">Click to upload image</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingGalleryImage}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = await uploadImage(file, setUploadingGalleryImage);
                      if (url) setGalleryForm({...galleryForm, image: url});
                    }
                    e.target.value = '';
                  }}
                />
              </label>

              {galleryForm.image && (
                <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-gray-200">
                  <img src={galleryForm.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold uppercase mb-1">Caption (Optional)</label>
            <input 
              value={galleryForm.caption || ''} 
              onChange={e => setGalleryForm({...galleryForm, caption: e.target.value})} 
              className="w-full p-3 border-2 border-gray-200 rounded-xl" 
              placeholder="e.g., Spacious Play Area"
            />
          </div>
          <button className="w-full bg-cat-black text-white font-bold py-4 rounded-xl mt-4 hover:bg-gray-800">
            SAVE IMAGE
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Admin;
