export const AVAILABLE_EXAM_TYPES = [
  { id: 'blood_test', name: 'Exame de Sangue (Completo)' },
  { id: 'urine_test', name: 'Exame de Urina (Urocultura)' },
  { id: 'x_ray_chest', name: 'Raio-X - Tórax' },
  { id: 'x_ray_knee', name: 'Raio-X - Joelho' },
  { id: 'ultrasound_thyroid', name: 'Ultrassom - Tireoide' },
  { id: 'ultrasound_abdomen', name: 'Ultrassom - Abdômen Total' },
  { id: 'mri_brain', name: 'Ressonância Magnética - Crânio' },
  { id: 'ecg', name: 'Eletrocardiograma (ECG)' },
];

export const EXAM_TYPES_MAP = new Map(
  AVAILABLE_EXAM_TYPES.map((exam) => [exam.id, exam.name]),
);
