
import React, { useState } from 'react';
import { Heart, Shield, Users, FileText, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import { ViewState } from '../types';
import SubPageNav from './SubPageNav';

interface CommunityProps {
    onBack: () => void;
    onNavigate: (view: ViewState) => void;
}

const Community: React.FC<CommunityProps> = ({ onBack, onNavigate }) => {
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const sections = [
        {
            id: 'adoption',
            title: 'Adoption',
            icon: <Heart className="w-6 h-6 text-cat-red" />,
            content: (
                <div className="space-y-4">
                    <p className="font-medium text-lg text-cat-black">Adoption is at the heart of our community efforts.</p>
                    <p>From time to time, cats or kittens under our care — or introduced through trusted rescuers and fosterers — may be available for adoption. Our role is to help facilitate responsible, well-considered matches between cats and adopters, always prioritising long-term wellbeing over urgency.</p>
                    <p className="italic text-cat-blue font-medium">Adoption is never rushed. The right match matters more than speed.</p>
                </div>
            )
        },
        {
            id: 'rescue',
            title: 'Rescue & Fostering Support',
            icon: <Shield className="w-6 h-6 text-cat-green" />,
            content: (
                <div className="space-y-4">
                    <p>While we are not a rescue organisation, we actively support rescue and fostering efforts by working alongside independent rescuers and fosterers who share our values.</p>
                    <p>Fostering provides cats — especially kittens, shy cats, or those recovering from stress — with the stability they need while awaiting adoption. Rescue efforts ensure cats receive protection, medical attention, and a chance to move forward.</p>
                    <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-cat-green">
                        <p className="font-bold mb-2">Our involvement focuses on:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Supporting ethical rescue and foster care</li>
                            <li>Creating pathways from rescue to adoption</li>
                            <li>Advocating responsible, lifelong ownership</li>
                        </ul>
                    </div>
                </div>
            )
        },
        {
            id: 'responsibility',
            title: 'A Shared Responsibility',
            icon: <Users className="w-6 h-6 text-cat-purple" />,
            content: (
                <div className="space-y-4">
                    <p>Rescue, fostering, and adoption are collective efforts grounded in responsibility rather than urgency.</p>
                    <p>Together, we can help more cats move from uncertainty to safety — and into homes where they are truly valued.</p>
                    <p className="font-medium text-cat-black">Because every cat deserves more than survival — they deserve a life shaped by care, patience, and understanding.</p>
                </div>
            )
        }
    ];

    const terms = [
        { title: "1. Eligibility & Approval", items: ["1.1 Adoption is open to individuals aged 21 years and above.", "1.2 All adoption enquiries are subject to assessment and approval.", "1.3 Submission of an enquiry does not guarantee adoption or availability."] },
        { title: "2. Adoption Process", items: ["2.1 All adoptions are subject to a screening and matching process.", "2.2 We reserve the right to decline, pause, or discontinue an adoption at any stage if we believe the placement is not in the cat’s best interest.", "2.3 Availability of cats may change without notice."] },
        { title: "3. Adoption Agreement", items: ["3.1 Approved adopters are required to review and sign a legally binding Adoption Agreement before adoption is finalised.", "3.2 The Adoption Agreement outlines adopter responsibilities, welfare obligations, and conditions relating to rehoming or return.", "3.3 Adoption will not proceed unless the agreement is fully executed."] },
        { title: "4. Health & Disclosure", items: ["4.1 Health and background information will be disclosed to the best of our knowledge at the time of adoption.", "4.2 We do not guarantee future health, temperament, or behaviour, as these may change with environment and care."] },
        { title: "5. Adopter Responsibilities", items: ["5.1 Adoption is a lifelong commitment.", "5.2 Adopters agree to provide appropriate veterinary care, nutrition, housing, and emotional support.", "5.3 Cats must not be abandoned, resold, or transferred without prior communication and consent."] },
        { title: "6. Returns & Rehoming", items: ["6.1 If an adoption does not work out, adopters must notify us or the relevant rescue/foster partner immediately.", "6.2 Cats must not be surrendered to shelters, third parties, or abandoned under any circumstances."] },
        { title: "7. Liability", items: ["7.1 Upon completion of adoption and execution of the Adoption Agreement, responsibility for the cat transfers fully to the adopter.", "7.2 We are not liable for post-adoption medical, behavioural, or adjustment issues."] },
        { title: "8. Amendments", items: ["8.1 We reserve the right to amend these Adoption Terms & Conditions at any time."] }
    ];

    return (
        <div className="min-h-screen bg-white pb-32 md:pb-20">
            <SubPageNav onBack={onBack} onNavigate={onNavigate} currentPage="community" />

            <div className="container mx-auto px-4 py-8 pt-24 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12 animate-fade-in-down">
                    <h1 className="text-5xl md:text-6xl font-black uppercase text-cat-black mb-4 tracking-tight">
                        Community <span className="text-transparent bg-clip-text bg-gradient-to-r from-cat-blue to-cat-purple">& Care</span>
                    </h1>
                    <p className="text-xl md:text-2xl font-bold text-gray-500 uppercase tracking-widest">
                        Adoption · Rescue · Fostering
                    </p>
                </div>

                {/* Intro */}
                <div className="bg-white rounded-3xl p-8 mb-12 shadow-md border-2 border-gray-100 animate-fade-in-up">
                    <p className="text-lg md:text-xl leading-relaxed text-gray-700">
                        Community & Care reflects our ongoing commitment to feline welfare beyond our daycare, boarding, and grooming services. It is where our support for adoption, rescue, and fostering comes together — guided by care, responsibility, and respect for every cat.
                    </p>
                    <div className="mt-6 border-t-2 border-gray-100 pt-6">
                        <p className="text-lg font-bold text-cat-black">This work is values-led, intentional, and shaped by years of lived experience.</p>
                    </div>
                </div>

                {/* Core Sections */}
                <div className="grid gap-6 mb-16">
                    {sections.map((section) => (
                        <div
                            key={section.id}
                            className="bg-white rounded-2xl overflow-hidden border-2 border-cat-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                        >
                            <div className="p-6 md:p-8">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-gray-50 rounded-xl border-2 border-gray-100">
                                        {section.icon}
                                    </div>
                                    <h2 className="text-2xl font-black uppercase">{section.title}</h2>
                                </div>
                                <div className="text-gray-700 leading-relaxed pl-0 md:pl-[4.5rem]">
                                    {section.content}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="bg-cat-black text-white rounded-3xl p-8 md:p-12 mb-16 text-center shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cat-blue rounded-full filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2 group-hover:opacity-30 transition-opacity"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-cat-purple rounded-full filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2 group-hover:opacity-30 transition-opacity"></div>

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl font-black uppercase mb-6">Adoption Enquiries & Community Collaboration</h2>
                        <div className="space-y-6 text-gray-300 mb-8">
                            <p>Community & Care initiatives are separate from our commercial services.</p>
                            <p>Availability of adoptable cats, rescue involvement, or fostering support may vary depending on capacity and individual circumstances.</p>
                            <p>For adoption enquiries or community collaboration, we welcome you to contact us directly to learn more about current or upcoming opportunities.</p>
                        </div>

                        <a
                            href="https://wa.me/60162058440?text=Hi!%20I'm%20interested%20in%20your%20community%20and%20adoption%20initiatives."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 bg-white text-cat-black font-black text-lg px-8 py-4 rounded-xl hover:bg-gray-100 hover:scale-105 transition-all shadow-[0px_0px_20px_rgba(255,255,255,0.3)]"
                        >
                            <MessageCircle size={24} />
                            WhatsApp Us
                        </a>

                        <p className="mt-8 text-sm text-gray-400 border-t border-gray-800 pt-6">
                            Adoption proceeds only after thoughtful discussion, appropriate screening, and mutual agreement — always with the cat’s best interest at heart.
                        </p>
                    </div>
                </div>

                {/* Terms & Conditions */}
                <div className="max-w-3xl mx-auto">
                    <button
                        onClick={() => toggleSection('terms')}
                        className="w-full flex items-center justify-between cursor-pointer p-4 rounded-xl hover:bg-gray-50 transition-colors group focus:outline-none"
                    >
                        <div className="flex items-center gap-3">
                            <FileText className="text-gray-400 group-hover:text-cat-black transition-colors" />
                            <h2 className="text-xl font-black uppercase text-gray-400 group-hover:text-cat-black transition-colors">Adoption Terms & Conditions</h2>
                        </div>
                        {expandedSection === 'terms' ? <ChevronUp className="text-cat-black" /> : <ChevronDown className="text-gray-400" />}
                    </button>

                    <div className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${expandedSection === 'terms' ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="pt-4 pb-8 px-4 space-y-8 text-gray-600 text-sm md:text-base">
                            <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 mb-8">
                                <p className="font-bold text-cat-orange mb-2">Important Notice</p>
                                <p>We believe responsible adoption begins with understanding, patience, and shared commitment. Adoption is subject to the following terms and conditions. By submitting an adoption enquiry or proceeding with adoption, you acknowledge and agree to these terms.</p>
                                <p className="mt-4 font-bold">All approved adoptions require the execution of a legally binding Adoption Agreement prior to completion.</p>
                            </div>

                            {terms.map((term, idx) => (
                                <div key={idx}>
                                    <h3 className="font-bold text-cat-black uppercase mb-3 text-lg">{term.title}</h3>
                                    <ul className="space-y-2 pl-4 border-l-2 border-gray-200">
                                        {term.items.map((item, i) => (
                                            <li key={i}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Community;
