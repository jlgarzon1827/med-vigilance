export const medicationRules = {
  nombre: {
    required: true,
    minLength: 3,
    pattern: /^[A-Za-zÀ-ÿ\s]+$/,
    message: "Ingrese un nombre de medicamento válido"
  },
  dosis: {
    required: true,
    pattern: /^\d+\s*(mg|g|ml)$/i,
    message: "Formato requerido: número seguido de 'mg', 'g' o 'ml' (ej: 500mg, 1g, 10ml)"
  },
  frecuencia: {
    required: true,
    pattern: /^(Cada\s+)?\d+\s*(horas|h)$/i,
    message: "Formato requerido: '[Cada] X horas/h' (ej: Cada 8 horas, 8h, 12 horas)"
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
