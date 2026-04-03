export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number; // Index 0-3
  prize: string;
}

export const TEAM_QUESTIONS: Record<string, Question[]> = {
  "Team A": [
    { id: 1, text: "What is the full form of CPU?", options: ["Central Process Unit", "Central Processing Unit", "Computer Processing Unit", "Control Unit"], correctAnswer: 1, prize: "₹10,000" },
    { id: 2, text: "Who is the father of C language?", options: ["James Gosling", "Bjarne Stroustrup", "Dennis Ritchie", "Guido van Rossum"], correctAnswer: 2, prize: "₹20,000" },
    { id: 3, text: "Ohm’s Law is:", options: ["F = ma", "P = VI", "E = mc²", "V = IR"], correctAnswer: 3, prize: "₹40,000" },
    { id: 4, text: "S.I Unit of pressure is:", options: ["Newton", "Joule", "Pascal", "Watt"], correctAnswer: 2, prize: "₹80,000" },
    { id: 5, text: "First supercomputer of India:", options: ["PARAM 8000", "CRAY", "IBM", "TATA"], correctAnswer: 0, prize: "₹1,60,000" },
    { id: 6, text: "Example of operating system:", options: ["MS Word", "Windows", "Excel", "Paint"], correctAnswer: 1, prize: "₹3,20,000" },
    { id: 7, text: "GPS stands for:", options: ["Global Positioning System", "General Position System", "Global Power System", "None"], correctAnswer: 0, prize: "₹6,40,000" },
    { id: 8, text: "FTP is used for:", options: ["Editing", "Printing", "Scanning", "File Transfer"], correctAnswer: 3, prize: "₹12,50,000" },
    { id: 9, text: "Transformer works on:", options: ["DC", "AC", "Both", "None"], correctAnswer: 1, prize: "₹25,00,000" },
    { id: 10, text: "Which device is used for modulation in communication systems?", options: ["Modulator", "Oscillator", "Amplifier", "Filter"], correctAnswer: 0, prize: "₹50,00,000" },
    { id: 11, text: "Which test is used to check the workability of concrete?", options: ["Tensile Test", "Compression Test", "Slump Test", "Hardness Test"], correctAnswer: 2, prize: "₹1,00,00,000" },
    { id: 12, text: "Which law states that energy cannot be created or destroyed?", options: ["Newton’s Law", "First Law of Thermodynamics", "Ohm’s Law", "Hooke’s Law"], correctAnswer: 1, prize: "₹2,00,00,000" },
    { id: 13, text: "What is the pH value of a neutral solution at 25°C?", options: ["0", "1", "7", "14"], correctAnswer: 2, prize: "₹3,00,00,000" },
    { id: 14, text: "Which element has the highest electronegativity?", options: ["Oxygen", "Nitrogen", "Chlorine", "Fluorine"], correctAnswer: 3, prize: "₹5,00,00,000" },
    { id: 15, text: "Which scientist is famous for experiments with prism and optics of light?", options: ["Christian Huygens", "Thomas Young", "Isaac Newton", "Galileo Galilei"], correctAnswer: 2, prize: "₹7,00,00,000" }
  ],
  "Team B": [
    { id: 1, text: "RAM is a type of:", options: ["Permanent Memory", "Temporary Memory", "Secondary Memory", "Cache Memory"], correctAnswer: 1, prize: "₹10,000" },
    { id: 2, text: "HTML is used for:", options: ["Programming", "Designing Web Pages", "Database", "Networking"], correctAnswer: 1, prize: "₹20,000" },
    { id: 3, text: "SI unit of force is:", options: ["Joule", "Watt", "Newton", "Pascal"], correctAnswer: 2, prize: "₹40,000" },
    { id: 4, text: "Which of the following is an output device?", options: ["Keyboard", "Mouse", "Monitor", "Scanner"], correctAnswer: 2, prize: "₹80,000" },
    { id: 5, text: "Unit of resistance is:", options: ["Ampere", "Volt", "Ohm", "Watt"], correctAnswer: 2, prize: "₹1,60,000" },
    { id: 6, text: "Which cycle is used in diesel engines?", options: ["Otto Cycle", "Diesel Cycle", "Rankine Cycle", "Brayton Cycle"], correctAnswer: 1, prize: "₹3,20,000" },
    { id: 7, text: "Which of the following is a strong electrolyte?", options: ["Sugar solution", "Urea solution", "NaCl solution", "Alcohol"], correctAnswer: 2, prize: "₹6,40,000" },
    { id: 8, text: "Father of C++:", options: ["Dennis Ritchie", "Bjarne Stroustrup", "Guido", "None"], correctAnswer: 1, prize: "₹12,50,000" },
    { id: 9, text: "Efficiency of heat engine is:", options: ["<100%", ">100%", "100%", "0"], correctAnswer: 0, prize: "₹25,00,000" },
    { id: 10, text: "Which gas is most abundant in Earth’s atmosphere?", options: ["Nitrogen", "Oxygen", "Carbon dioxide", "Hydrogen"], correctAnswer: 0, prize: "₹50,00,000" },
    { id: 11, text: "What is the standard size of a brick (approx.)?", options: ["250×125×125 mm", "200×100×100 mm", "150×75×75 mm", "190×90×90 mm"], correctAnswer: 3, prize: "₹1,00,00,000" },
    { id: 12, text: "Which layer of OSI model handles data transmission?", options: ["Physical", "Data Link", "Network", "Transport"], correctAnswer: 0, prize: "₹2,00,00,000" },
    { id: 13, text: "Which device converts mechanical energy into electrical energy?", options: ["Motor", "Pump", "Generator", "Compressor"], correctAnswer: 2, prize: "₹3,00,00,000" },
    { id: 14, text: "Which law is used in stress-strain relationship?", options: ["Newton’s Law", "Hooke’s Law", "Boyle’s Law", "Ohm’s Law"], correctAnswer: 1, prize: "₹5,00,00,000" },
    { id: 15, text: "Which protocol is used for email?", options: ["HTTP", "FTP", "TCP", "SMTP"], correctAnswer: 3, prize: "₹7,00,00,000" }
  ],
  "Team C": [
    { id: 1, text: "What does “www” stand for?", options: ["World Wide Web", "Web World Wide", "Wide Web World", "None"], correctAnswer: 0, prize: "₹10,000" },
    { id: 2, text: "Binary digits are:", options: ["1,2", "2,3", "0,1", "0–9"], correctAnswer: 2, prize: "₹20,000" },
    { id: 3, text: "Which material is used as a binding material in construction?", options: ["Sand", "Cement", "Aggregate", "Steel"], correctAnswer: 1, prize: "₹40,000" },
    { id: 4, text: "Which particle has no charge?", options: ["Proton", "Electron", "Neutron", "Ion"], correctAnswer: 2, prize: "₹80,000" },
    { id: 5, text: "Which law states that every action has an equal and opposite reaction?", options: ["First Law", "Second Law", "Third Law", "Law of Gravitation"], correctAnswer: 2, prize: "₹1,60,000" },
    { id: 6, text: "Which material is used for reinforcement in RCC?", options: ["Sand", "Cement", "Brick", "Steel"], correctAnswer: 3, prize: "₹3,20,000" },
    { id: 7, text: "Creator of Python:", options: ["James Gosling", "Guido van Rossum", "Bjarne", "None"], correctAnswer: 1, prize: "₹6,40,000" },
    { id: 8, text: "Which cycle is used in petrol engines?", options: ["Diesel Cycle", "Otto Cycle", "Rankine Cycle", "Brayton Cycle"], correctAnswer: 1, prize: "₹12,50,000" },
    { id: 9, text: "Which property defines resistance to flow in fluids?", options: ["Viscosity", "Density", "Elasticity", "Conductivity"], correctAnswer: 0, prize: "₹25,00,000" },
    { id: 10, text: "Which of the following is a weak electrolyte?", options: ["NaCl", "HCl", "KOH", "CH₃COOH"], correctAnswer: 3, prize: "₹50,00,000" },
    { id: 11, text: "Which gas is used in respiration?", options: ["Nitrogen", "Oxygen", "Hydrogen", "Carbon monoxide"], correctAnswer: 1, prize: "₹1,00,00,000" },
    { id: 12, text: "“T” in IoT stands for:", options: ["Time", "Transfer", "Technology", "Things"], correctAnswer: 3, prize: "₹2,00,00,000" },
    { id: 13, text: "In a simply supported beam, maximum shear force occurs at:", options: ["Mid-span", "Supports", "Quarter span", "Center"], correctAnswer: 1, prize: "₹3,00,00,000" },
    { id: 14, text: "Carnot engine is related to:", options: ["Thermodynamics", "Electricity", "Mechanics", "Optics"], correctAnswer: 0, prize: "₹5,00,00,000" },
    { id: 15, text: "Which protocol is used for transferring web pages on the internet?", options: ["FTP", "HTTP", "SMTP", "TCP"], correctAnswer: 1, prize: "₹7,00,00,000" }
  ],
  "Team D": [
    { id: 1, text: "AI stands for:", options: ["Artificial Intelligence", "Automatic Input", "Active Interface", "None"], correctAnswer: 0, prize: "₹10,000" },
    { id: 2, text: "SI unit of energy is:", options: ["Joule", "Watt", "Pascal", "Newton"], correctAnswer: 0, prize: "₹20,000" },
    { id: 3, text: "Stress is:", options: ["Area/Force", "Force/Area", "Force × Area", "None"], correctAnswer: 1, prize: "₹40,000" },
    { id: 4, text: "Carnot engine is related to:", options: ["Electricity", "Optics", "Mechanics", "Thermodynamics"], correctAnswer: 3, prize: "₹80,000" },
    { id: 5, text: "LAN stands for:", options: ["Local Area Network", "Large Area Network", "Long Area Network", "None"], correctAnswer: 0, prize: "₹1,60,000" },
    { id: 6, text: "Encryption is used for:", options: ["Speed", "Storage", "Security", "Design"], correctAnswer: 2, prize: "₹3,20,000" },
    { id: 7, text: "Which memory is non-volatile?", options: ["RAM", "Cache", "ROM", "Register"], correctAnswer: 2, prize: "₹6,40,000" },
    { id: 8, text: "Who is the father of Java?", options: ["James Gosling", "Dennis Ritchie", "Guido van Rossum", "Elon Musk"], correctAnswer: 0, prize: "₹12,50,000" },
    { id: 9, text: "Which of the following is an input device?", options: ["Printer", "Monitor", "Speaker", "Keyboard"], correctAnswer: 3, prize: "₹25,00,00,000" },
    { id: 10, text: "Which test is used to check strength of cement?", options: ["Slump test", "Compression test", "Tensile test", "Impact test"], correctAnswer: 1, prize: "₹50,00,000" },
    { id: 11, text: "Which compound is an acid?", options: ["NaOH", "H₂SO₄", "NH₃", "CaO"], correctAnswer: 1, prize: "₹1,00,00,000" },
    { id: 12, text: "Example of semiconductor:", options: ["Copper", "Glass", "Wood", "Silicon"], correctAnswer: 3, prize: "₹2,00,00,000" },
    { id: 13, text: "SQL is used for:", options: ["Programming", "Design", "Database", "Network"], correctAnswer: 2, prize: "₹3,00,00,000" },
    { id: 14, text: "Which is used for measuring angles in surveying?", options: ["Chain", "Compass", "Theodolite", "Level"], correctAnswer: 2, prize: "₹5,00,00,000" },
    { id: 15, text: "Which language is used for web pages?", options: ["HTML", "C", "Java", "Python"], correctAnswer: 0, prize: "₹7,00,00,000" }
  ],
  "FFF": [
    { id: 1, text: "USB stands for:", options: ["Universal Serial Bus", "United System Bus", "Unique Serial Bus", "None"], correctAnswer: 0, prize: "Round 1" },
    { id: 2, text: "Which salt is neutral?", options: ["NaCl", "HCl", "NaOH", "NH₄Cl"], correctAnswer: 0, prize: "Round 1" },
    { id: 3, text: "Which atom has smallest size?", options: ["Hydrogen", "Helium", "Oxygen", "Carbon"], correctAnswer: 1, prize: "Round 1" },
    { id: 4, text: "GPS stands for:", options: ["Global Positioning System", "General Position System", "Global Power System", "None"], correctAnswer: 0, prize: "Round 1" },
    { id: 5, text: "1 Byte =", options: ["4 bits", "8 bits", "16 bits", "32 bits"], correctAnswer: 1, prize: "Round 1" },
    { id: 6, text: "Which part of the computer is called the \"brain\"?", options: ["RAM", "Hard Disk", "CPU", "Monitor"], correctAnswer: 2, prize: "Round 1" },
    { id: 7, text: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], correctAnswer: 1, prize: "Round 1" },
    { id: 8, text: "Which device is used to store data permanently?", options: ["RAM", "Cache", "Hard Disk", "Register"], correctAnswer: 2, prize: "Round 1" },
    { id: 9, text: "Which vitamin is produced in human skin by sunlight?", options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"], correctAnswer: 3, prize: "Round 1" },
    { id: 10, text: "What is the unit of electric current?", options: ["Volt", "Ampere", "Watt", "Ohm"], correctAnswer: 1, prize: "Round 1" },
    { id: 11, text: "Which scientist is known for the theory of relativity?", options: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Nikola Tesla"], correctAnswer: 1, prize: "Round 1" }
  ],
  "Tie Breaker": [
    { id: 1, text: "Cloud computing is:", options: ["Offline storage", "Internet-based service", "Hardware", "None"], correctAnswer: 1, prize: "Tie Breaker" },
    { id: 2, text: "Which engine uses spark plug?", options: ["Diesel Engine", "Petrol Engine", "Steam Engine", "Gas Turbine"], correctAnswer: 1, prize: "Tie Breaker" }
  ]
};

export const QUIZ_QUESTIONS: Question[] = TEAM_QUESTIONS["Team A"];
