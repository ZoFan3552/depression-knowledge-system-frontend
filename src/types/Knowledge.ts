export interface Cause {
    name: string;
}

export interface Diagnosis {
    name: string;
}

export interface Medication {
    name: string;
}

export interface Prevention {
    name: string;
}

export interface Symptom {
    name: string;
}

export interface Treatment {
    name: string;
}

export interface Depression {
    name: string;
    symptoms: Set<Symptom>;
    causes: Set<Cause>;
    diagnoses: Set<Diagnosis>;
    preventions: Set<Prevention>;
    treatments: Set<Treatment>;
    medications: Set<Medication>;
}
