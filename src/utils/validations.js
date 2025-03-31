export const medicationRules = {
  nombre: {
    required: true,
    minLength: 3,
    pattern: /^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s]{2,}$/,
    message: "El nombre debe empezar con letra y contener solo letras y espacios (mínimo 3 caracteres)"
  },
  dosis: {
    required: true,
    pattern: /^\d+(\.\d+)?\s*(mg|g|ml|mcg|mcg\/dosis)$/i,
    message: "Formato requerido: número seguido de 'mg', 'g', 'ml', 'mcg' o 'mcg/dosis' (ej: 500mg, 1g, 10ml, 100mcg/dosis)"
  },  
  frecuencia: {
    required: true,
    pattern: /^(?:\d+\s*(horas|h|días|d|semanas|s|meses|m)|OD|BID|TID|PRN)$/i,
    message: "Formato requerido: número seguido de 'horas', 'h', 'días', 'd', 'semanas', 's', 'meses', 'm' o abreviaturas como OD, BID, TID, PRN"
  }  
}

export const userRules = {
  username: {
    required: true,
    minLength: 3,
    pattern: /^[a-zA-Z0-9]+$/,
    message: "Usuario debe contener solo letras y números"
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Ingrese un email válido"
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
    message: "La contraseña debe tener al menos 8 caracteres, incluyendo letras y números"
  }
}

export const validateMedication = (field, value) => {
  const rule = medicationRules[field]
  
  // Validación básica
  if (!value && rule.required) {
    return 'Este campo es requerido'
  }

  // Validación de longitud mínima para el nombre
  if (field === 'nombre' && value.length < rule.minLength) {
    return `Mínimo ${rule.minLength} caracteres`
  }

  // Validación de formato
  if (!rule.pattern.test(value)) {
    return rule.message
  }

  // Validaciones específicas adicionales
  if (field === 'nombre' && /^[0-9]/.test(value)) {
    return 'El nombre no puede empezar con números'
  }

  // Normalización de valores
  if (field === 'frecuencia') {
    value = value.toLowerCase().replace('horas', 'h')
  }

  return null
}

export function validateUserField(field, value) {
  const rule = userRules[field]
  if (!value && rule.required) {
    return rule.message
  }
  if (value.length < rule.minLength) {
    return `Mínimo ${rule.minLength} caracteres`
  }
  if (!rule.pattern.test(value)) {
    return rule.message
  }
  return null
}
