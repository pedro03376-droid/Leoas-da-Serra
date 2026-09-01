/**
 * Curva cinematografica unica compartilhada por todo o motion system.
 * Nunca usar linear nem ease padrao em reveals.
 */
export const EASE_CINEMATIC = "cubic-bezier(0.16, 1, 0.3, 1)" as const;
export const EASE_CINEMATIC_GSAP = "power4.out" as const;
