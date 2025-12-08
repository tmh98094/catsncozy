
import { Cat, Service, Testimonial } from './types';

export const HERO_IMAGE_URL = "https://i.ibb.co/6JncStMp/Gemini-Generated-Image-41zkbo41zkbo41zk.png";

export const CATS: Cat[] = [
  {
    id: 1,
    name: "Mochi",
    dateOfBirth: "2022-12-08",
    breed: "Scottish Fold",
    gender: "Female",
    image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80&w=800",
    personality: ["Playful", "Cuddly"]
  },
  {
    id: 2,
    name: "Luna",
    dateOfBirth: "2024-06-08",
    breed: "Domestic Short Hair",
    gender: "Female",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800",
    personality: ["Curious", "Energetic"]
  },
  {
    id: 3,
    name: "Garfield",
    dateOfBirth: "2019-12-08",
    breed: "Persian",
    gender: "Male",
    image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&q=80&w=800",
    personality: ["Lazy", "Foodie", "Chill"]
  },
  {
    id: 4,
    name: "Shadow",
    dateOfBirth: "2023-12-08",
    breed: "Bombay",
    gender: "Male",
    image: "https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&q=80&w=800",
    personality: ["Mysterious", "Quiet"]
  },
  {
    id: 5,
    name: "Sunny",
    dateOfBirth: "2021-12-08",
    breed: "Maine Coon",
    gender: "Male",
    image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=800",
    personality: ["Gentle Giant", "Friendly"]
  },
  {
    id: 6,
    name: "Bella",
    dateOfBirth: "2020-12-08",
    breed: "Siamese",
    gender: "Female",
    image: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80&w=800",
    personality: ["Vocal", "Intelligent"]
  },
  {
    id: 7,
    name: "Oliver",
    dateOfBirth: "2024-10-08",
    breed: "Tabby",
    gender: "Male",
    image: "https://images.unsplash.com/photo-1519052537078-e6302a4968ef?auto=format&fit=crop&q=80&w=800",
    personality: ["Playful", "Tiny"]
  },
  {
    id: 8,
    name: "Cleo",
    dateOfBirth: "2017-12-08",
    breed: "Sphynx",
    gender: "Female",
    image: "https://images.unsplash.com/photo-1516280030429-27679b3dc9cf?auto=format&fit=crop&q=80&w=800",
    personality: ["Affectionate", "Warm"]
  }
];

export const SERVICES: Service[] = [
  {
    id: 1,
    title: "Cozy Suite",
    price: "$35/night",
    description: "Private suite with window view, soft bedding, and daily playtime.",
    icon: "bed",
    images: [
        "https://images.unsplash.com/photo-1541781777631-faaf8221835f?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: 2,
    title: "Royal Treatment",
    price: "$55/night",
    description: "Larger suite, gourmet treats, grooming session, and video calls.",
    icon: "crown",
    images: [
        "https://images.unsplash.com/photo-1596272875729-ed2ff7d6d9c5?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1519052537078-e6302a4968ef?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: 3,
    title: "Daycare",
    price: "$25/day",
    description: "Social play for active cats. Perfect for busy work days.",
    icon: "sun",
    images: [
        "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=800"
    ]
  }
];

export const ABOUT_GALLERY = [
    { id: 1, image: "https://images.unsplash.com/photo-1511044568932-33842851211d?auto=format&fit=crop&q=80&w=1000" },
    { id: 2, image: "https://images.unsplash.com/photo-1608848461950-0fe51dfc41cb?auto=format&fit=crop&q=80&w=1000" },
    { id: 3, image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&q=80&w=1000" },
    { id: 4, image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&q=80&w=1000" },
    { id: 5, image: "https://images.unsplash.com/photo-1495360019602-e001c276375f?auto=format&fit=crop&q=80&w=1000" },
    { id: 6, image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=1000" },
    { id: 7, image: "https://images.unsplash.com/photo-1519052537078-e6302a4968ef?auto=format&fit=crop&q=80&w=1000" },
    { id: 8, image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=1000" },
    { id: 9, image: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80&w=1000" }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Cat Mom of 2",
    feedback: "The best place for my Mochi! She came back so happy and well-groomed. The daily updates gave me so much peace of mind.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: 2,
    name: "David Chen",
    role: "Frequent Traveler",
    feedback: "I never worry when I travel for work. The team at Cats & Cozy treats Oliver like their own. Highly recommended!",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: 3,
    name: "Emily Wilson",
    role: "Adopter",
    feedback: "We found our perfect match here. The adoption process was thorough and caring. Luna is the light of our lives!",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: 4,
    name: "Jessica Lee",
    role: "First Time Owner",
    feedback: "The staff were so helpful in guiding me through my first adoption. They really care about the cats.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200"
  }
];

export const FAQ_ITEMS = [
  {
    id: 1,
    question: "What vaccinations are required for boarding?",
    answer: "All cats must be up-to-date on FVRCP (Feline Viral Rhinotracheitis, Calicivirus, and Panleukopenia) and Rabies vaccinations. We also strongly recommend FeLV (Feline Leukemia) vaccination. Please bring proof of vaccination records."
  },
  {
    id: 2,
    question: "Can I visit my cat during their stay?",
    answer: "Absolutely! We encourage visits during our operating hours (9 AM - 6 PM daily). However, we recommend waiting 24 hours after drop-off to allow your cat to settle in comfortably."
  },
  {
    id: 3,
    question: "What's included in the boarding price?",
    answer: "All boarding packages include premium cat food, fresh water, daily cleaning, playtime, and 24/7 monitoring. Royal Treatment also includes grooming, gourmet treats, and video call updates."
  },
  {
    id: 4,
    question: "How does the adoption process work?",
    answer: "First, browse our available cats and submit an inquiry. We'll schedule a meet-and-greet, conduct a home check, and discuss care requirements. Once approved, you'll sign adoption papers and pay the adoption fee (RM 150-300). We provide initial vet records and support!"
  },
  {
    id: 5,
    question: "What if my cat has special dietary needs?",
    answer: "We're happy to accommodate! You can bring your cat's preferred food, or we can source special dietary options. Just let us know during booking, and there's no extra charge for feeding your own food."
  },
  {
    id: 6,
    question: "What's your cancellation policy?",
    answer: "Cancellations made 7+ days before check-in receive a full refund. 3-6 days notice gets 50% refund. Less than 3 days notice is non-refundable. We understand emergencies happen - contact us to discuss."
  }
];

export const FACILITY_GALLERY = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&q=80&w=800",
    caption: "Spacious Play Area"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=800",
    caption: "Cozy Private Suites"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1596272875729-ed2ff7d6d9c5?auto=format&fit=crop&q=80&w=800",
    caption: "Luxury Lounging Spots"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?auto=format&fit=crop&q=80&w=800",
    caption: "Climate Controlled Rooms"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80&w=800",
    caption: "Happy Residents"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1511044568932-33842851211d?auto=format&fit=crop&q=80&w=800",
    caption: "Safe & Secure Environment"
  }
];
