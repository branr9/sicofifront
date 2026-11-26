// @ts-nocheck
import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, PLATFORM_ID, inject } from '@angular/core';

@Component({
  selector: 'app-programacion',
  imports: [],
  templateUrl: './programacion.html',
  styleUrl: './programacion.css',
})
export class Programacion implements AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID);

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

            if (window.lucide) lucide.createIcons();

            const TOTAL_TRIMESTER_WEEKS = 12;
            const MAX_INSTRUCTOR_HOURS = 40;

            // Estado global de asignaciones: { "LUN-Bloque 1": [{ instId, instName, startW, endW, raText, color, resIds, compId }] }
            const scheduleState = {};

            let pendingAssignment = {
                instructor: null,
                targetZones: [],
                startW: null,
                endW: null,
                raText: '',
                resIds: [],
                compId: null
            };

            const poolEl = document.getElementById('instructors-pool');
            const dropzones = document.querySelectorAll('.dropzone');
            const fractionModal = document.getElementById('fraction-modal');
            const swapModal = document.getElementById('swap-modal');
            const compareFichasModal = document.getElementById('compare-fichas-modal');
            const weeksGrid = document.getElementById('modal-weeks-grid');
            const searchInstructorInput = document.getElementById('search-instructor');
            const searchCompetenciesInput = document.getElementById('search-competencies');
            const btnClearAll = document.getElementById('btn-clear-all');
            const btnSelectAll = document.getElementById('btn-select-all');
            const btnSaveSchedule = document.getElementById('btn-save-schedule');
            const btnGlobalSwap = document.getElementById('btn-global-swap');
            const btnCompareFichas = document.getElementById('btn-compare-fichas');

            // Registrar horas base
            document.querySelectorAll('.instructor-card').forEach(card => {
                const h = parseInt(card.getAttribute('data-hours') || '0', 10);
                card.setAttribute('data-base-hours', h);
            });

            // Data de Competencias y RAs por Fase de Formación
            const PHASES_DATA = {
                analisis: {
                    title: "Fase 1: Análisis",
                    competencies: [
                        {
                            id: "comp-220501093",
                            code: "220501093",
                            name: "Evaluar requisitos de la solución de software",
                            type: "Técnica",
                            color: "brand",
                            results: [
                                { id: "res-101", text: "Modelar las funciones del software de acuerdo con el informe de requisitos." },
                                { id: "res-102", text: "Planear actividades de análisis de acuerdo con la metodología seleccionada." },
                                { id: "res-103", text: "Verificar los modelos realizados en la fase de análisis." }
                            ]
                        },
                        {
                            id: "comp-240201524",
                            code: "240201524",
                            name: "Interactuar en el contexto productivo y social (Enrique Low Murtra)",
                            type: "Transversal",
                            color: "purple",
                            results: [
                                { id: "res-201", text: "Promover la cultura de paz con base en principios éticos." }
                            ]
                        },
                        {
                            id: "comp-240202501",
                            code: "240202501",
                            name: "Interactuar en lengua inglesa de forma oral y escrita",
                            type: "Transversal",
                            color: "blue",
                            results: [
                                { id: "res-301", text: "Comprender información sobre situaciones cotidianas y laborales actuales." }
                            ]
                        }
                    ]
                },
                planeacion: {
                    title: "Fase 2: Planeación",
                    competencies: [
                        {
                            id: "comp-220501094",
                            code: "220501094",
                            name: "Diseñar la solución de software según procedimientos técnicos",
                            type: "Técnica",
                            color: "brand",
                            results: [
                                { id: "res-401", text: "Diseñar la arquitectura del software según requisitos." },
                                { id: "res-402", text: "Elaborar el modelo de datos relacional y no relacional." },
                                { id: "res-403", text: "Diseñar la interfaz de usuario UI/UX según prototipos." }
                            ]
                        },
                        {
                            id: "comp-240201526",
                            code: "240201526",
                            name: "Aplicar tecnologías de la información y comunicación (TIC)",
                            type: "Transversal",
                            color: "purple",
                            results: [
                                { id: "res-501", text: "Optimizar procesos de trabajo mediante herramientas digitales." }
                            ]
                        },
                        {
                            id: "comp-240202501-p",
                            code: "240202501",
                            name: "Interactuar en lengua inglesa (Inglés Técnico)",
                            type: "Transversal",
                            color: "blue",
                            results: [
                                { id: "res-302", text: "Producir textos sencillos en inglés sobre especificaciones técnicas." }
                            ]
                        }
                    ]
                },
                ejecucion: {
                    title: "Fase 3: Ejecución",
                    competencies: [
                        {
                            id: "comp-220501095",
                            code: "220501095",
                            name: "Desarrollar la solución de software según el diseño de arquitectura",
                            type: "Técnica",
                            color: "brand",
                            results: [
                                { id: "res-601", text: "Construir la base de datos de acuerdo con el diseño." },
                                { id: "res-602", text: "Codificar los módulos backend y frontend de la aplicación." },
                                { id: "res-603", text: "Ejecutar pruebas unitarias e integración de componentes." }
                            ]
                        },
                        {
                            id: "comp-220501096",
                            code: "220501096",
                            name: "Implantar la solución de software en la plataforma de destino",
                            type: "Técnica",
                            color: "brand",
                            results: [
                                { id: "res-701", text: "Desplegar la aplicación en servidor de producción o nube." }
                            ]
                        },
                        {
                            id: "comp-240201528",
                            code: "240201528",
                            name: "Razonar cuantitativamente en la solución de problemas",
                            type: "Transversal",
                            color: "purple",
                            results: [
                                { id: "res-801", text: "Resolver problemas de lógica matemática aplicados al desarrollo." }
                            ]
                        }
                    ]
                },
                evaluacion: {
                    title: "Fase 4: Evaluación",
                    competencies: [
                        {
                            id: "comp-220501097",
                            code: "220501097",
                            name: "Validar la solución de software según criterios de aceptación",
                            type: "Técnica",
                            color: "brand",
                            results: [
                                { id: "res-901", text: "Ejecutar pruebas de aceptación del sistema con el cliente final." },
                                { id: "res-902", text: "Elaborar la documentación técnica y el manual de usuario." }
                            ]
                        },
                        {
                            id: "comp-240201530",
                            code: "240201530",
                            name: "Formular proyectos de emprendimiento tecnológico",
                            type: "Transversal",
                            color: "purple",
                            results: [
                                { id: "res-951", text: "Evaluar la viabilidad comercial y técnica del proyecto de software." }
                            ]
                        }
                    ]
                }
            };

            // Nombres en español para días y horas de bloques
            const DAY_LABELS = {
                'LUN': 'Lunes',
                'MAR': 'Martes',
                'MIE': 'Miércoles',
                'JUE': 'Jueves',
                'VIE': 'Viernes',
                'SAB': 'Sábado'
            };

            const BLOCK_TIME_LABELS = {
                'Bloque 1': '06:00 a 10:00',
                'Bloque 2': '10:00 a 14:00'
            };

            // Estructura de Mock Data de Capacidades, Restricciones e Historial de Instructores
            const INSTRUCTORS_DATA = {
                'inst-1': {
                    id: 'inst-1',
                    name: 'German Ramírez',
                    initials: 'GR',
                    area: 'Análisis y Metodologías de Software',
                    color: 'emerald',
                    baseHours: 32,
                    canTeachRAs: [
                        'res-101', 'res-102', 'res-103', // Fase 1 Técnica
                        'res-401', 'res-402',            // Fase 2 Técnica
                        'res-601', 'res-602', 'res-603', 'res-701', // Fase 3 Técnica
                        'res-901', 'res-902'             // Fase 4 Técnica
                    ],
                    restrictions: [
                        {
                            day: 'JUE',
                            block: 'Bloque 1',
                            time: '06:00 a 10:00',
                            reason: 'Tiene clase en la Universidad UCEVA',
                            institution: 'Universidad UCEVA'
                        },
                        {
                            day: 'SAB',
                            block: 'Bloque 2',
                            time: '10:00 a 14:00',
                            reason: 'Atención a proyectos de innovación e investigación SENNOVA',
                            institution: 'SENNOVA'
                        }
                    ],
                    historicalSchedules: [
                        {
                            period: 'Periodo 2025-4 (Histórico)',
                            fichaId: '2184491',
                            program: 'Multimedia',
                            jornada: 'Diurna',
                            day: 'LUN',
                            block: 'Bloque 2',
                            time: '10:00 a 14:00',
                            raText: 'Diseñar la interfaz de usuario UI/UX según prototipos'
                        }
                    ]
                },
                'inst-2': {
                    id: 'inst-2',
                    name: 'Lizeth Giraldo',
                    initials: 'LG',
                    area: 'Transversal - Ética, Paz & Emprendimiento',
                    color: 'purple',
                    baseHours: 36,
                    canTeachRAs: [
                        'res-201', // Fase 1 Transversal (Ética y Paz)
                        'res-801', // Fase 3 Transversal (Matemáticas)
                        'res-951'  // Fase 4 Transversal (Emprendimiento)
                    ],
                    restrictions: [
                        {
                            day: 'MIE',
                            block: 'Bloque 2',
                            time: '10:00 a 14:00',
                            reason: 'Participación en Comité de Convivencia y Ética Profesional',
                            institution: 'Comité de Centro SENA'
                        }
                    ],
                    historicalSchedules: [
                        {
                            period: 'Periodo 2025-4 (Histórico)',
                            fichaId: '1982345',
                            program: 'Redes',
                            jornada: 'Diurna',
                            day: 'MAR',
                            block: 'Bloque 1',
                            time: '06:00 a 10:00',
                            raText: 'Promover la cultura de paz con base en principios éticos'
                        }
                    ]
                },
                'inst-3': {
                    id: 'inst-3',
                    name: 'Mónica Laverde',
                    initials: 'ML',
                    area: 'Transversal - Bilingüismo & Inglés Técnico',
                    color: 'blue',
                    baseHours: 28,
                    canTeachRAs: [
                        'res-301', // Fase 1 Transversal (Inglés)
                        'res-302'  // Fase 2 Transversal (Inglés Técnico)
                    ],
                    restrictions: [
                        {
                            day: 'VIE',
                            block: 'Bloque 1',
                            time: '06:00 a 10:00',
                            reason: 'Capacitación Metodológica en Enseñanza de Bilingüismo',
                            institution: 'Centro de Idiomas SENA'
                        }
                    ],
                    historicalSchedules: [
                        {
                            period: 'Periodo 2025-4 (Histórico)',
                            fichaId: '3237741',
                            program: 'ADSO',
                            jornada: 'Diurna',
                            day: 'VIE',
                            block: 'Bloque 2',
                            time: '10:00 a 14:00',
                            raText: 'Comprender información sobre situaciones cotidianas y laborales'
                        }
                    ]
                },
                'inst-4': {
                    id: 'inst-4',
                    name: 'Juan Camilo Martínez',
                    initials: 'JM',
                    area: 'Algoritmos, TIC & Desarrollo Backend',
                    color: 'indigo',
                    baseHours: 24,
                    canTeachRAs: [
                        'res-101', 'res-102', // Fase 1 Técnica
                        'res-401', 'res-403', 'res-501', // Fase 2 Técnica y TIC
                        'res-602', 'res-603'  // Fase 3 Técnica (Codificación y pruebas)
                    ],
                    restrictions: [
                        {
                            day: 'LUN',
                            block: 'Bloque 1',
                            time: '06:00 a 10:00',
                            reason: 'Mantenimiento y Administración de Laboratorios TIC',
                            institution: 'Coordinación TIC SENA'
                        },
                        {
                            day: 'SAB',
                            block: 'Bloque 1',
                            time: '06:00 a 10:00',
                            reason: 'Entrenamiento Selección SENA WorldSkills en Desarrollo Web',
                            institution: 'WorldSkills Colombia'
                        }
                    ],
                    historicalSchedules: [
                        {
                            period: 'Periodo 2025-3 (Histórico)',
                            fichaId: '3237750',
                            program: 'Enfermería',
                            jornada: 'Diurna',
                            day: 'JUE',
                            block: 'Bloque 2',
                            time: '10:00 a 14:00',
                            raText: 'Optimizar procesos de trabajo mediante herramientas digitales'
                        }
                    ]
                }
            };

            // Sembrar programaciones iniciales en otras fichas activas para que existan conflictos reales entre fichas
            function initializeDefaultCrossFicheSchedules() {
                if (!localStorage.getItem('kronos_schedule_2184491')) {
                    const data = {
                        fichaId: '2184491',
                        program: 'multimedia',
                        jornada: 'diurna',
                        fase: 'planeacion',
                        period: 'Periodo 2026-1 (Activo)',
                        scheduleState: {
                            'MAR-Bloque 2': [{
                                instId: 'inst-1',
                                instName: 'German Ramírez',
                                startW: 1,
                                endW: 12,
                                raText: 'Diseñar la solución de software según procedimientos técnicos',
                                color: 'emerald',
                                resIds: ['res-401'],
                                compId: 'comp-220501094'
                            }]
                        },
                        hiddenResIds: ['res-401'],
                        isGridComplete: false,
                        fullBlocks: 1,
                        totalBlocks: 12,
                        totalAssignedWeeks: 12,
                        savedAt: new Date().toISOString()
                    };
                    localStorage.setItem('kronos_schedule_2184491', JSON.stringify(data));
                }

                if (!localStorage.getItem('kronos_schedule_3237742')) {
                    const data = {
                        fichaId: '3237742',
                        program: 'adso',
                        jornada: 'nocturna',
                        fase: 'analisis',
                        period: 'Periodo 2026-1 (Activo)',
                        scheduleState: {
                            'LUN-Bloque 1': [{
                                instId: 'inst-2',
                                instName: 'Lizeth Giraldo',
                                startW: 1,
                                endW: 12,
                                raText: 'Promover la cultura de paz con base en principios éticos',
                                color: 'purple',
                                resIds: ['res-201'],
                                compId: 'comp-240201524'
                            }]
                        },
                        hiddenResIds: ['res-201'],
                        isGridComplete: false,
                        fullBlocks: 1,
                        totalBlocks: 12,
                        totalAssignedWeeks: 12,
                        savedAt: new Date().toISOString()
                    };
                    localStorage.setItem('kronos_schedule_3237742', JSON.stringify(data));
                }

                if (!localStorage.getItem('kronos_schedule_1982345')) {
                    const data = {
                        fichaId: '1982345',
                        program: 'redes',
                        jornada: 'diurna',
                        fase: 'analisis',
                        period: 'Periodo 2026-1 (Activo)',
                        scheduleState: {
                            'MIE-Bloque 1': [{
                                instId: 'inst-3',
                                instName: 'Mónica Laverde',
                                startW: 1,
                                endW: 12,
                                raText: 'Interactuar en lengua inglesa de forma oral y escrita',
                                color: 'blue',
                                resIds: ['res-301'],
                                compId: 'comp-240202501'
                            }]
                        },
                        hiddenResIds: ['res-301'],
                        isGridComplete: false,
                        fullBlocks: 1,
                        totalBlocks: 12,
                        totalAssignedWeeks: 12,
                        savedAt: new Date().toISOString()
                    };
                    localStorage.setItem('kronos_schedule_1982345', JSON.stringify(data));
                }

                if (!localStorage.getItem('kronos_schedule_3237750')) {
                    const data = {
                        fichaId: '3237750',
                        program: 'enfermeria',
                        jornada: 'diurna',
                        fase: 'planeacion',
                        period: 'Periodo 2026-1 (Activo)',
                        scheduleState: {
                            'VIE-Bloque 2': [{
                                instId: 'inst-4',
                                instName: 'Juan Camilo Martínez',
                                startW: 1,
                                endW: 12,
                                raText: 'Aplicar tecnologías de la información y comunicación',
                                color: 'indigo',
                                resIds: ['res-501'],
                                compId: 'comp-240201526'
                            }]
                        },
                        hiddenResIds: ['res-501'],
                        isGridComplete: false,
                        fullBlocks: 1,
                        totalBlocks: 12,
                        totalAssignedWeeks: 12,
                        savedAt: new Date().toISOString()
                    };
                    localStorage.setItem('kronos_schedule_3237750', JSON.stringify(data));
                }
            }

            // Obtener asignaciones activas de un instructor en otras fichas activas (excluyendo la ficha actual y periodos históricos)
            function getActiveCrossFicheAssignmentsForInstructor(instId, excludeFichaId = null) {
                const assignments = [];
                const activeFicha = excludeFichaId || getActiveFichaId();

                FICHAS_CATALOG.forEach(ficha => {
                    if (ficha.id === activeFicha) return;

                    const raw = localStorage.getItem(`kronos_schedule_${ficha.id}`);
                    if (!raw) return;

                    try {
                        const data = JSON.parse(raw);
                        if (data.periodType === 'historical' || data.isHistorical === true) {
                            return; // No bloquea si es histórico
                        }

                        const state = data.scheduleState || {};
                        Object.keys(state).forEach(key => {
                            const list = state[key] || [];
                            list.forEach(asn => {
                                if (asn.instId === instId) {
                                    const [day, block] = key.split('-');
                                    assignments.push({
                                        fichaId: ficha.id,
                                        program: ficha.programLabel || data.program,
                                        jornada: ficha.jornadaLabel || data.jornada,
                                        day: day,
                                        block: block,
                                        time: BLOCK_TIME_LABELS[block] || block,
                                        raText: asn.raText,
                                        startW: asn.startW,
                                        endW: asn.endW,
                                        period: data.period || 'Periodo 2026-1 (Activo)'
                                    });
                                }
                            });
                        });
                    } catch (e) {
                        console.error(e);
                    }
                });

                return assignments;
            }

            // Calcular horas acumuladas actuales de un instructor (base + bloques asignados en scheduleState)
            function getInstructorCurrentHours(instId) {
                const card = document.querySelector(`.instructor-card[data-id="${instId}"]`);
                const instData = INSTRUCTORS_DATA[instId];
                let baseHours = 0;
                if (card && typeof card.getAttribute === 'function' && card.getAttribute('data-base-hours')) {
                    baseHours = parseInt(card.getAttribute('data-base-hours'), 10) || 0;
                } else if (instData && typeof instData.baseHours === 'number') {
                    baseHours = instData.baseHours;
                }

                let blocksCount = 0;
                Object.values(scheduleState).forEach(list => {
                    if (Array.isArray(list)) {
                        list.forEach(asn => {
                            if (asn.instId === instId) blocksCount++;
                        });
                    }
                });

                return baseHours + (blocksCount * 4);
            }

            // ==========================================
            // MOTOR CENTRALIZADO DE VALIDACIÓN DE DISPONIBILIDAD Y RESTRICCIONES
            // ==========================================
            function validateInstructorAvailability(instId, customOptions = {}) {
                const inst = INSTRUCTORS_DATA[instId];
                if (!inst) {
                    return { valid: true, reasonType: 'OK', message: 'Disponible', shortBadgeText: 'Disponible', badgeColorClass: 'text-brand-700 bg-brand-50 border-brand-200' };
                }

                // 1. Zonas objetivo (bloques seleccionados)
                let targetZones = customOptions.targetZones;
                if (!targetZones) {
                    targetZones = Array.from(document.querySelectorAll('.dropzone.is-selected'));
                }

                // 2. Resultados de Aprendizaje seleccionados
                let resIds = customOptions.resIds;
                if (resIds === undefined) {
                    const compData = getCheckedCompetencyResults();
                    resIds = compData.resIds || [];
                }

                const checkWorkload = customOptions.checkWorkload !== false;
                const currentFichaId = customOptions.currentFichaId || getActiveFichaId();

                // CRITERIO 1: EVALUAR COMPATIBILIDAD CON RESULTADOS DE APRENDIZAJE (RA_INCOMPATIBLE)
                // Un instructor es compatible ÚNICAMENTE si puede impartir TODOS los RAs seleccionados
                if (resIds && resIds.length > 0) {
                    const missingRAs = resIds.filter(id => !inst.canTeachRAs.includes(id));
                    if (missingRAs.length > 0) {
                        return {
                            valid: false,
                            reasonType: 'RA_INCOMPATIBLE',
                            shortBadgeText: 'No compatible',
                            badgeColorClass: 'text-rose-700 bg-rose-50 border-rose-200',
                            message: 'Este instructor no puede impartir todos los Resultados de Aprendizaje seleccionados.',
                            details: { missingRAs: missingRAs }
                        };
                    }
                }

                // CRITERIO 2: EVALUAR RESTRICCIÓN HORARIA EN EL DÍA/BLOQUE EXACTO (RESTRICTION)
                if (targetZones && targetZones.length > 0) {
                    for (const zone of targetZones) {
                        const day = typeof zone === 'string' ? zone.split('-')[0] : zone.getAttribute('data-day');
                        const block = typeof zone === 'string' ? zone.split('-')[1] : zone.getAttribute('data-block');
                        const dayName = DAY_LABELS[day] || day;
                        const blockTime = BLOCK_TIME_LABELS[block] || block;

                        const matchedRestriction = (inst.restrictions || []).find(r => r.day === day && (r.block === block || !r.block));
                        if (matchedRestriction) {
                            return {
                                valid: false,
                                reasonType: 'RESTRICTION',
                                shortBadgeText: 'Restricción',
                                badgeColorClass: 'text-amber-700 bg-amber-50 border-amber-200',
                                message: `Este instructor no puede ser programado el ${dayName} de ${blockTime} porque ${matchedRestriction.reason}.`,
                                details: { restriction: matchedRestriction, day: day, block: block }
                            };
                        }
                    }
                }

                // CRITERIO 3: EVALUAR CONFLICTO CON OTRA FICHA ACTIVA EN EL MISMO DÍA/HORA (ACTIVE_FICHE_CONFLICT)
                if (targetZones && targetZones.length > 0) {
                    const activeCrossAssignments = getActiveCrossFicheAssignmentsForInstructor(instId, currentFichaId);
                    for (const zone of targetZones) {
                        const day = typeof zone === 'string' ? zone.split('-')[0] : zone.getAttribute('data-day');
                        const block = typeof zone === 'string' ? zone.split('-')[1] : zone.getAttribute('data-block');
                        const dayName = DAY_LABELS[day] || day;
                        const blockTime = BLOCK_TIME_LABELS[block] || block;

                        const conflict = activeCrossAssignments.find(a => a.day === day && a.block === block);
                        if (conflict) {
                            return {
                                valid: false,
                                reasonType: 'ACTIVE_FICHE_CONFLICT',
                                shortBadgeText: 'Conflicto Ficha',
                                badgeColorClass: 'text-amber-800 bg-amber-100 border-amber-300',
                                message: `Este instructor no puede ser programado porque ya está asignado a la Ficha ${conflict.fichaId} (${conflict.program} ${conflict.jornada}) el ${dayName} de ${blockTime}.`,
                                details: { conflict: conflict, day: day, block: block }
                            };
                        }
                    }
                }

                // CRITERIO 4: EVALUAR LÍMITE DE CARGA HORARIA SEMANAL MÁXIMA DE 40H (MAX_WORKLOAD)
                const currentHours = getInstructorCurrentHours(instId);
                const addedHours = (targetZones && targetZones.length > 0) ? targetZones.length * 4 : 0;
                if (checkWorkload && (currentHours + addedHours > MAX_INSTRUCTOR_HOURS)) {
                    return {
                        valid: false,
                        reasonType: 'MAX_WORKLOAD',
                        shortBadgeText: 'Carga Máxima',
                        badgeColorClass: 'text-red-700 bg-red-50 border-red-200',
                        message: 'Este instructor no puede ser programado porque superaría el límite de 40h semanales.',
                        details: { currentHours: currentHours, addedHours: addedHours, totalHours: currentHours + addedHours }
                    };
                }

                if (currentHours >= MAX_INSTRUCTOR_HOURS) {
                    return {
                        valid: false,
                        reasonType: 'MAX_WORKLOAD',
                        shortBadgeText: 'Carga Máxima (40h)',
                        badgeColorClass: 'text-red-700 bg-red-50 border-red-200',
                        message: 'Este instructor no puede ser programado porque superaría el límite de 40h semanales.',
                        details: { currentHours: currentHours }
                    };
                }

                // INSTRUCTOR TOTALMENTE HABILITADO
                return {
                    valid: true,
                    reasonType: 'OK',
                    shortBadgeText: 'Disponible',
                    badgeColorClass: 'text-brand-700 bg-brand-50 border-brand-200',
                    message: 'Instructor disponible para asignación.',
                    details: { currentHours: currentHours }
                };
            }

            // Actualizar dinámicamente el estado visual de todas las tarjetas de instructores
            function updateAllInstructorsAvailability() {
                const selectedZones = Array.from(document.querySelectorAll('.dropzone.is-selected'));
                const compData = getCheckedCompetencyResults();
                const resIds = compData.resIds || [];

                document.querySelectorAll('.instructor-card').forEach(card => {
                    const instId = card.getAttribute('data-id');
                    const validation = validateInstructorAvailability(instId, {
                        targetZones: selectedZones,
                        resIds: resIds
                    });

                    const statusBadge = card.querySelector('.status-badge');
                    const assignBtn = card.querySelector('.btn-assign-click');
                    const reasonBox = card.querySelector('.instructor-reason-box');
                    const reasonText = card.querySelector('.instructor-reason-text');

                    if (!validation.valid) {
                        card.classList.add('opacity-60', 'bg-slate-50/80');
                        card.setAttribute('data-disabled', 'true');

                        if (statusBadge) {
                            statusBadge.innerText = validation.shortBadgeText;
                            statusBadge.className = `status-badge font-semibold px-1.5 py-0.5 rounded text-[10px] border ${validation.badgeColorClass}`;
                        }

                        if (assignBtn) {
                            assignBtn.classList.add('opacity-40', 'pointer-events-none', 'cursor-not-allowed');
                            assignBtn.setAttribute('title', validation.message);
                        }

                        if (reasonBox && reasonText) {
                            reasonText.innerText = validation.message;
                            reasonBox.classList.remove('hidden');
                        }
                    } else {
                        card.classList.remove('opacity-60', 'bg-slate-50/80');
                        card.removeAttribute('data-disabled');

                        if (statusBadge) {
                            statusBadge.innerText = validation.shortBadgeText;
                            statusBadge.className = `status-badge font-semibold px-1.5 py-0.5 rounded text-[10px] border ${validation.badgeColorClass}`;
                        }

                        if (assignBtn) {
                            assignBtn.classList.remove('opacity-40', 'pointer-events-none', 'cursor-not-allowed');
                            assignBtn.setAttribute('title', 'Asignar a bloques seleccionados');
                        }

                        if (reasonBox) {
                            reasonBox.classList.add('hidden');
                        }
                    }
                });

                if (activeModalInstId) {
                    const modal = document.getElementById('instructor-details-modal');
                    if (modal && !modal.classList.contains('hidden')) {
                        renderInstructorAvailabilityMatrix(activeModalInstId);
                    }
                }

                if (window.lucide) lucide.createIcons();
            }

            let activeModalInstId = null;

            // Renderizar la Matriz de Disponibilidad Semanal (Días x Bloques) del instructor
            function renderInstructorAvailabilityMatrix(instId) {
                const inst = INSTRUCTORS_DATA[instId];
                const container = document.getElementById('modal-inst-detail-availability-grid');
                if (!container || !inst) return;

                const days = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];
                const blocks = ['Bloque 1', 'Bloque 2'];

                const currentFicha = getActiveFichaId();
                const crossAssignments = getActiveCrossFicheAssignmentsForInstructor(instId, currentFicha);

                let html = '';

                days.forEach(day => {
                    const dayLabel = DAY_LABELS[day] || day;

                    html += `
                        <div class="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 flex flex-col">
                            <div class="bg-slate-100/90 px-2 py-1 border-b border-slate-200 text-center font-extrabold text-slate-700 text-[11px] uppercase tracking-wider">
                                ${dayLabel.substring(0, 3)}
                            </div>
                            <div class="p-1.5 space-y-1.5 flex-1 flex flex-col justify-between">
                    `;

                    blocks.forEach(block => {
                        const timeLabel = BLOCK_TIME_LABELS[block] || block;
                        const key = `${day}-${block}`;

                        let statusType = 'FREE';
                        let title = 'Disponible';
                        let detail = 'Libre';
                        let cardStyle = 'bg-emerald-50/80 border-emerald-200/90 text-emerald-900';
                        let badgeStyle = 'bg-emerald-100 text-emerald-800 border-emerald-200 font-bold';
                        let icon = 'check-circle-2';

                        const currentFichaList = scheduleState[key] || [];
                        const currentAsn = currentFichaList.find(asn => asn.instId === instId);

                        if (currentAsn) {
                            statusType = 'CURRENT_FICHA';
                            title = `Ficha ${currentFicha}`;
                            detail = currentAsn.raText ? (currentAsn.raText.length > 30 ? currentAsn.raText.substring(0, 30) + '...' : currentAsn.raText) : 'Asignación activa';
                            cardStyle = 'bg-brand-50 border-brand-300 text-brand-950 shadow-2xs';
                            badgeStyle = 'bg-brand-100 text-brand-900 border-brand-300 font-extrabold';
                            icon = 'calendar-check';
                        } else {
                            const crossConflict = crossAssignments.find(a => a.day === day && a.block === block);
                            if (crossConflict) {
                                statusType = 'CROSS_FICHA';
                                title = `Ficha ${crossConflict.fichaId}`;
                                const progName = crossConflict.program || 'Otra Ficha';
                                detail = `${progName} • ${crossConflict.raText ? (crossConflict.raText.length > 20 ? crossConflict.raText.substring(0, 20) + '...' : crossConflict.raText) : ''}`;
                                cardStyle = 'bg-indigo-50/90 border-indigo-200 text-indigo-950 shadow-2xs';
                                badgeStyle = 'bg-indigo-100 text-indigo-900 border-indigo-300 font-bold';
                                icon = 'building-2';
                            } else {
                                const matchedRestriction = (inst.restrictions || []).find(r => r.day === day && (r.block === block || !r.block));
                                if (matchedRestriction) {
                                    statusType = 'RESTRICTION';
                                    title = matchedRestriction.institution || 'Restricción';
                                    detail = matchedRestriction.reason;
                                    cardStyle = 'bg-amber-50 border-amber-300 text-amber-950 shadow-2xs';
                                    badgeStyle = 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
                                    icon = 'alert-triangle';
                                }
                            }
                        }

                        html += `
                            <div class="p-1.5 border rounded-lg ${cardStyle} transition-all">
                                <div class="flex items-center justify-between gap-1 mb-1">
                                    <span class="text-[9px] font-bold opacity-75 uppercase tracking-tight">${timeLabel}</span>
                                    <span class="text-[8px] px-1 py-0.2 rounded border ${badgeStyle} inline-flex items-center gap-0.5 shrink-0">
                                        <i data-lucide="${icon}" class="w-2.5 h-2.5"></i>
                                        ${statusType === 'FREE' ? 'Libre' : (statusType === 'CURRENT_FICHA' ? 'Ficha Activa' : (statusType === 'CROSS_FICHA' ? 'Otra Ficha' : 'Ocupado'))}
                                    </span>
                                </div>
                                <div class="text-[10px] leading-tight font-semibold truncate" title="${title}: ${detail}">
                                    ${statusType === 'FREE' ? '<span class="text-emerald-700 font-medium">Disponible</span>' : `<strong class="font-bold">${title}</strong>: <span class="font-normal opacity-90">${detail}</span>`}
                                </div>
                            </div>
                        `;
                    });

                    html += `
                            </div>
                        </div>
                    `;
                });

                container.innerHTML = html;
                if (window.lucide) lucide.createIcons();
            }

            // Abrir y poblar el modal de información y restricciones del instructor
            function openInstructorDetailsModal(instId, targetSection = null) {
                activeModalInstId = instId;
                const inst = INSTRUCTORS_DATA[instId];
                if (!inst) return;

                const modal = document.getElementById('instructor-details-modal');
                if (!modal) return;

                // Renderizar matriz de disponibilidad semanal
                renderInstructorAvailabilityMatrix(instId);

                const nameEl = document.getElementById('modal-inst-detail-name');
                const areaEl = document.getElementById('modal-inst-detail-area');
                const avatarEl = document.getElementById('modal-inst-avatar');
                const statusPill = document.getElementById('modal-inst-detail-status-pill');
                const hoursText = document.getElementById('modal-inst-detail-hours-text');
                const hoursBar = document.getElementById('modal-inst-detail-hours-bar');

                const currentHours = getInstructorCurrentHours(instId);
                const pct = Math.min(100, Math.round((currentHours / MAX_INSTRUCTOR_HOURS) * 100));

                if (nameEl) nameEl.innerText = inst.name;
                if (areaEl) areaEl.innerText = inst.area;
                if (avatarEl) {
                    avatarEl.innerText = inst.initials;
                    avatarEl.className = `w-11 h-11 rounded-2xl bg-${inst.color}-100 text-${inst.color}-800 font-bold text-sm flex items-center justify-center border border-${inst.color}-200 shadow-2xs shrink-0`;
                }

                if (statusPill) {
                    if (currentHours >= MAX_INSTRUCTOR_HOURS) {
                        statusPill.innerText = 'Carga Máxima (40h)';
                        statusPill.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200';
                    } else {
                        statusPill.innerText = 'Activo';
                        statusPill.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-100 text-brand-800 border border-brand-200';
                    }
                }

                if (hoursText) hoursText.innerText = `${currentHours} / 40h (${40 - currentHours}h disponibles)`;
                if (hoursBar) {
                    hoursBar.style.width = `${pct}%`;
                    hoursBar.className = `h-full rounded-full transition-all duration-300 ${currentHours >= MAX_INSTRUCTOR_HOURS ? 'bg-red-500' : 'bg-brand-500'}`;
                }

                // 1. RAs Habilitados
                const raListEl = document.getElementById('modal-inst-detail-ra-list');
                const raCountEl = document.getElementById('modal-inst-detail-ra-count');
                if (raListEl) {
                    const canTeach = inst.canTeachRAs || [];
                    if (raCountEl) raCountEl.innerText = `${canTeach.length} RAs`;

                    const raItems = [];
                    Object.values(PHASES_DATA).forEach(phase => {
                        phase.competencies.forEach(comp => {
                            comp.results.forEach(res => {
                                if (canTeach.includes(res.id)) {
                                    raItems.push({
                                        id: res.id,
                                        text: res.text,
                                        compName: comp.name,
                                        compCode: comp.code,
                                        phaseTitle: phase.title,
                                        color: comp.color || 'emerald'
                                    });
                                }
                            });
                        });
                    });

                    if (raItems.length > 0) {
                        raListEl.innerHTML = raItems.map(item => `
                            <div class="flex items-start gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                                <span class="w-2 h-2 rounded-full bg-${item.color}-500 mt-1 shrink-0"></span>
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center gap-1.5 flex-wrap">
                                        <span class="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-${item.color}-100 text-${item.color}-800">${item.phaseTitle}</span>
                                        <span class="text-[10px] text-slate-400 font-semibold">${item.compCode}</span>
                                    </div>
                                    <p class="font-medium text-slate-800 leading-snug mt-0.5">${item.text}</p>
                                </div>
                            </div>
                        `).join('');
                    } else {
                        raListEl.innerHTML = `<div class="text-slate-400 text-center py-2">Sin Resultados de Aprendizaje asignados.</div>`;
                    }
                }

                // 2. Restricciones
                const restListEl = document.getElementById('modal-inst-detail-restrictions-list');
                if (restListEl) {
                    const restrictions = inst.restrictions || [];
                    if (restrictions.length > 0) {
                        restListEl.innerHTML = restrictions.map(r => `
                            <div class="p-2.5 bg-amber-100/60 border border-amber-300/80 rounded-xl text-xs flex items-start gap-2.5">
                                <div class="p-1 bg-amber-200 text-amber-900 rounded-md shrink-0 mt-0.5">
                                    <i data-lucide="alert-triangle" class="w-3.5 h-3.5"></i>
                                </div>
                                <div>
                                    <div class="flex items-center gap-2">
                                        <strong class="text-amber-950 font-bold">${DAY_LABELS[r.day] || r.day} (${r.time})</strong>
                                        <span class="text-[9px] font-bold bg-amber-200/80 text-amber-900 px-1.5 py-0.2 rounded">${r.institution || 'Restricción'}</span>
                                    </div>
                                    <p class="text-amber-900 mt-0.5 leading-snug">${r.reason}</p>
                                </div>
                            </div>
                        `).join('');
                    } else {
                        restListEl.innerHTML = `<div class="text-slate-500 text-center py-1.5">No registra restricciones horarias fijas.</div>`;
                    }
                }

                // 3. Horario Activo en Formación
                const activeSchedEl = document.getElementById('modal-inst-detail-active-schedule');
                const activeCountEl = document.getElementById('modal-inst-detail-active-count');
                if (activeSchedEl) {
                    const activeList = [];
                    const currentFicha = getActiveFichaId();
                    const currentMeta = getCompareFichaMeta(currentFicha);

                    Object.keys(scheduleState).forEach(key => {
                        const list = scheduleState[key] || [];
                        list.forEach(asn => {
                            if (asn.instId === instId) {
                                const [day, block] = key.split('-');
                                activeList.push({
                                    fichaId: currentFicha,
                                    program: currentMeta.programLabel,
                                    jornada: currentMeta.jornadaLabel,
                                    day: day,
                                    block: block,
                                    time: BLOCK_TIME_LABELS[block] || block,
                                    raText: asn.raText,
                                    startW: asn.startW,
                                    endW: asn.endW,
                                    isCurrentFicha: true
                                });
                            }
                        });
                    });

                    const cross = getActiveCrossFicheAssignmentsForInstructor(instId, currentFicha);
                    cross.forEach(c => activeList.push({ ...c, isCurrentFicha: false }));

                    if (activeCountEl) activeCountEl.innerText = `${activeList.length} Bloques`;

                    if (activeList.length > 0) {
                        activeSchedEl.innerHTML = activeList.map(item => `
                            <div class="p-2.5 ${item.isCurrentFicha ? 'bg-emerald-50/80 border-emerald-200' : 'bg-slate-50 border-slate-200'} border rounded-xl flex items-start justify-between gap-2 text-xs">
                                <div class="space-y-0.5">
                                    <div class="flex items-center gap-1.5 flex-wrap">
                                        <strong class="text-slate-900">${DAY_LABELS[item.day] || item.day} (${item.time})</strong>
                                        <span class="text-[10px] font-bold ${item.isCurrentFicha ? 'bg-emerald-100 text-brand-800' : 'bg-slate-200 text-slate-700'} px-1.5 py-0.2 rounded">
                                            Ficha ${item.fichaId} • ${item.program} (${item.jornada})
                                        </span>
                                        ${item.isCurrentFicha ? '<span class="text-[9px] font-extrabold text-emerald-700 bg-emerald-100/90 px-1.5 py-0.2 rounded">Ficha Activa</span>' : ''}
                                    </div>
                                    <div class="text-slate-600 text-[11px] leading-tight">${item.raText}</div>
                                </div>
                                <span class="text-[10px] font-semibold text-slate-500 shrink-0">Sem ${item.startW}-${item.endW}</span>
                            </div>
                        `).join('');
                    } else {
                        activeSchedEl.innerHTML = `<div class="text-slate-400 text-center py-2">Sin bloques activos asignados en este momento.</div>`;
                    }
                }

                // 4. Historial de Periodos Finalizados (Solo Informativo - No bloquea programación)
                const histEl = document.getElementById('modal-inst-detail-history-list');
                if (histEl) {
                    const history = inst.historicalSchedules || [];
                    if (history.length > 0) {
                        histEl.innerHTML = history.map(h => `
                            <div class="p-2 bg-white border border-slate-200 rounded-lg text-xs flex items-center justify-between gap-2 opacity-80">
                                <div>
                                    <div class="flex items-center gap-1.5">
                                        <span class="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">${h.period}</span>
                                        <strong class="text-slate-700">Ficha ${h.fichaId} (${h.program})</strong>
                                    </div>
                                    <p class="text-[11px] text-slate-500 mt-0.5">${DAY_LABELS[h.day] || h.day} (${h.time}) - ${h.raText}</p>
                                </div>
                                <span class="text-[9px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Finalizado</span>
                            </div>
                        `).join('');
                    } else {
                        histEl.innerHTML = `<div class="text-slate-400 text-center py-1.5">Sin historial previo registrado.</div>`;
                    }
                }

                if (window.lucide) lucide.createIcons();
                modal.classList.remove('hidden');

                if (targetSection === 'availability') {
                    setTimeout(() => {
                        const availSec = document.getElementById('modal-inst-detail-availability-section');
                        if (availSec) availSec.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }, 50);
                }
            }

            function closeInstructorDetailsModal() {
                activeModalInstId = null;
                const modal = document.getElementById('instructor-details-modal');
                if (modal) modal.classList.add('hidden');
            }

            const closeInstModalBtns = [
                document.getElementById('btn-close-instructor-details-modal'),
                document.getElementById('btn-close-instructor-details-footer')
            ];
            closeInstModalBtns.forEach(btn => {
                if (btn) btn.addEventListener('click', closeInstructorDetailsModal);
            });

            function clearOtherCompetencies(currentCard) {
                document.querySelectorAll('.competency-card').forEach(otherCard => {
                    if (otherCard !== currentCard) {
                        otherCard.querySelectorAll('.competency-check').forEach(chk => chk.checked = false);
                        const parentCheck = otherCard.querySelector('.select-all-competency');
                        if (parentCheck) {
                            parentCheck.checked = false;
                            parentCheck.indeterminate = false;
                        }
                    }
                });
            }

            function bindCompetencyEvents() {
                document.querySelectorAll('.competency-card').forEach(card => {
                    const parentCheck = card.querySelector('.select-all-competency');
                    const itemChecks = card.querySelectorAll('.competency-check');

                    if (parentCheck) {
                        parentCheck.addEventListener('change', (e) => {
                            const isChecked = e.target.checked;
                            if (isChecked) clearOtherCompetencies(card);

                            itemChecks.forEach(chk => {
                                const itemLabel = chk.closest('.competency-item');
                                if (itemLabel && itemLabel.style.display !== 'none') {
                                    chk.checked = isChecked;
                                }
                            });
                            updateAllInstructorsAvailability();
                        });
                    }

                    itemChecks.forEach(chk => {
                        chk.addEventListener('change', (e) => {
                            if (e.target.checked) clearOtherCompetencies(card);

                            const visibleItems = Array.from(card.querySelectorAll('.competency-item')).filter(item => item.style.display !== 'none');
                            const visibleChecked = visibleItems.filter(item => {
                                const c = item.querySelector('.competency-check');
                                return c && c.checked;
                            }).length;

                            if (parentCheck) {
                                parentCheck.checked = visibleChecked === visibleItems.length && visibleItems.length > 0;
                                parentCheck.indeterminate = visibleChecked > 0 && visibleChecked < visibleItems.length;
                            }
                            updateAllInstructorsAvailability();
                        });
                    });
                });
            }

            function renderCompetenciesForPhase(phaseKey) {
                const container = document.getElementById('competencies-container');
                if (!container) return;

                const data = PHASES_DATA[phaseKey] || PHASES_DATA['analisis'];
                container.innerHTML = '';

                // Obtener todos los RAs asignados en cualquier fase
                const assignedResultIds = new Set();
                Object.values(scheduleState).forEach(list => {
                    list.forEach(asn => {
                        if (asn.resIds && Array.isArray(asn.resIds)) {
                            asn.resIds.forEach(id => assignedResultIds.add(id));
                        }
                    });
                });

                data.competencies.forEach(comp => {
                    const card = document.createElement('div');
                    card.className = 'competency-card border border-slate-200 rounded-xl p-3 bg-slate-50/50 space-y-2 hover:bg-slate-50 transition-colors';
                    card.setAttribute('data-comp-id', comp.id);

                    const typeBg = comp.color === 'purple' ? 'bg-purple-100 text-purple-800' : (comp.color === 'blue' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800');
                    const dotBg = comp.color === 'purple' ? 'bg-purple-500' : (comp.color === 'blue' ? 'bg-blue-500' : 'bg-brand-500');

                    let resultsHtml = '';
                    comp.results.forEach(res => {
                        const isAssigned = assignedResultIds.has(res.id);
                        const displayStyle = isAssigned ? 'display: none;' : 'display: flex;';
                        resultsHtml += `
                            <label data-result-id="${res.id}" style="${displayStyle}"
                                class="competency-item items-start gap-2 cursor-pointer text-xs text-slate-700 hover:text-slate-900">
                                <input type="checkbox"
                                    class="competency-check mt-0.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500 accent-brand-600 w-3.5 h-3.5">
                                <span class="leading-tight">${res.text}</span>
                            </label>
                        `;
                    });

                    card.innerHTML = `
                        <div class="flex items-center justify-between gap-2 pb-2 border-b border-slate-200/80">
                            <div class="flex items-start gap-2">
                                <span class="w-2 h-2 rounded-full ${dotBg} mt-1.5 shrink-0"></span>
                                <div>
                                    <h3 class="text-xs font-bold text-slate-900 leading-snug">${comp.name}</h3>
                                    <div class="flex items-center gap-1.5 mt-0.5">
                                        <span class="text-[10px] text-slate-400 font-semibold">Código: ${comp.code}</span>
                                        <span class="text-[9px] ${typeBg} font-bold px-1.5 py-0.2 rounded">${comp.type}</span>
                                    </div>
                                </div>
                            </div>
                            <label class="flex items-center gap-1 cursor-pointer bg-slate-100 hover:bg-brand-50 border border-slate-200 px-2 py-0.5 rounded-md text-[10px] font-semibold text-slate-600 transition-all shrink-0">
                                <input type="checkbox" class="select-all-competency rounded text-brand-600 focus:ring-brand-500 accent-brand-600 w-3 h-3">
                                <span>Todos</span>
                            </label>
                        </div>
                        <div class="space-y-2 pl-2 pt-1 competency-results-list">
                            ${resultsHtml}
                        </div>
                    `;

                    container.appendChild(card);
                });

                bindCompetencyEvents();
                updateCompetenciesProgress();
                updateAllInstructorsAvailability();
            }

            // Obtener RAs seleccionados
            function getCheckedCompetencyResults() {
                const checkedChecks = document.querySelectorAll('.competency-check:checked');
                const assignedResultIds = [];
                const checkedResultTexts = [];
                let compId = null;

                checkedChecks.forEach(chk => {
                    const itemLabel = chk.closest('.competency-item');
                    const compCard = chk.closest('.competency-card');
                    if (compCard) compId = compCard.getAttribute('data-comp-id');

                    if (itemLabel && itemLabel.style.display !== 'none') {
                        const resId = itemLabel.getAttribute('data-result-id');
                        const textSpan = itemLabel.querySelector('span');
                        const text = textSpan ? textSpan.innerText.trim() : '';
                        if (resId) assignedResultIds.push(resId);
                        if (text) checkedResultTexts.push(text);
                    }
                });

                let raSummary = '';
                if (checkedResultTexts.length === 1) {
                    raSummary = checkedResultTexts[0];
                } else if (checkedResultTexts.length > 1) {
                    raSummary = `${checkedResultTexts.length} Resultados de Aprendizaje`;
                }

                return {
                    resIds: assignedResultIds,
                    raText: raSummary,
                    compId: compId
                };
            }

            const phaseCompletionAlertShown = {};

            // Actualizar el progreso visual de la fase y permitir cambiar de fase al completar RAs
            function updateCompetenciesProgress() {
                const activePhase = document.getElementById('select-fase-ficha')?.value || 'analisis';
                const allItems = document.querySelectorAll('.competency-item');
                let total = allItems.length;
                let hidden = 0;

                allItems.forEach(item => {
                    if (item.style.display === 'none') hidden++;
                });

                const pct = total > 0 ? Math.round((hidden / total) * 100) : 0;
                const textEl = document.getElementById('phase-progress-text');
                const barEl = document.getElementById('phase-progress-bar');
                if (textEl) textEl.innerText = `${pct}% Asignado`;
                if (barEl) barEl.style.width = `${pct}%`;

                // Si se agotan los RAs de la fase activa, sugerir cambiar a la siguiente fase
                if (pct === 100 && total > 0 && !phaseCompletionAlertShown[activePhase]) {
                    phaseCompletionAlertShown[activePhase] = true;

                    const nextPhaseMap = {
                        analisis: 'planeacion',
                        planeacion: 'ejecucion',
                        ejecucion: 'evaluacion'
                    };

                    const nextPhaseKey = nextPhaseMap[activePhase];

                    if (nextPhaseKey) {
                        const nextPhaseName = PHASES_DATA[nextPhaseKey]?.title || nextPhaseKey;
                        const currentPhaseName = PHASES_DATA[activePhase]?.title || activePhase;

                        Swal.fire({
                            icon: 'info',
                            title: '¡Fase Completada!',
                            html: `Se han asignado todos los Resultados de Aprendizaje de la <strong>${currentPhaseName}</strong>.<br><br>¿Deseas pasar automáticamente a la <strong>${nextPhaseName}</strong> para continuar completando los bloques restantes de la parrilla?`,
                            showCancelButton: true,
                            confirmButtonColor: '#16a34a',
                            cancelButtonColor: '#64748b',
                            confirmButtonText: `Avanzar a ${nextPhaseName}`,
                            cancelButtonText: 'Permanecer aquí'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                const selectFase = document.getElementById('select-fase-ficha');
                                if (selectFase) {
                                    selectFase.value = nextPhaseKey;
                                    renderCompetenciesForPhase(nextPhaseKey);
                                    Toastify({
                                        text: `Cargados RAs de ${nextPhaseName}`,
                                        duration: 3000,
                                        style: { background: "#16a34a", borderRadius: "10px", fontSize: "12px" }
                                    }).showToast();
                                }
                            }
                        });
                    }
                }
            }

            // Calcular el estado de completitud real de los 12 BLOQUES de la Parrilla
            function getScheduleGridCompletionStatus() {
                let fullBlocks = 0;
                let partialBlocks = 0;
                let emptyBlocks = 0;
                let totalAssignedWeeks = 0;

                dropzones.forEach(zone => {
                    const key = `${zone.getAttribute('data-day')}-${zone.getAttribute('data-block')}`;
                    const occupied = getOccupiedWeeksForZone(key);
                    const count = occupied.size;
                    totalAssignedWeeks += count;

                    if (count === TOTAL_TRIMESTER_WEEKS) {
                        fullBlocks++;
                    } else if (count > 0) {
                        partialBlocks++;
                    } else {
                        emptyBlocks++;
                    }
                });

                const isGridComplete = fullBlocks === dropzones.length;
                const totalPossibleWeeks = dropzones.length * TOTAL_TRIMESTER_WEEKS;

                return {
                    fullBlocks,
                    partialBlocks,
                    emptyBlocks,
                    totalAssignedWeeks,
                    totalPossibleWeeks,
                    isGridComplete,
                    totalBlocks: dropzones.length
                };
            }

            // ==========================================
            // SORTABLE Y DRAG & DROP
            // ==========================================
            if (typeof Sortable !== 'undefined' && poolEl) {
                new Sortable(poolEl, {
                    group: { name: 'instructors', pull: 'clone', put: false },
                    sort: false,
                    animation: 200,
                    ghostClass: 'sortable-ghost',
                    dragClass: 'sortable-drag',
                    onMove: function (evt) {
                        // Impedir arrastre si el instructor no es compatible / está deshabilitado
                        if (evt.dragged && evt.dragged.getAttribute('data-disabled') === 'true') {
                            return false;
                        }
                    }
                });
            }

            dropzones.forEach(zone => {
                if (typeof Sortable !== 'undefined') {
                    new Sortable(zone, {
                        group: { name: 'instructors', put: (to, from) => from.el === poolEl },
                        animation: 200,
                        ghostClass: 'sortable-ghost',
                        onAdd: function (evt) {
                            evt.item.remove();

                            const instId = evt.item.getAttribute('data-id');
                            const instName = evt.item.getAttribute('data-name');
                            const color = evt.item.getAttribute('data-color') || 'emerald';

                            // Validar disponibilidad específica para este bloque y los RAs seleccionados
                            const compData = getCheckedCompetencyResults();
                            const validation = validateInstructorAvailability(instId, {
                                targetZones: [zone],
                                resIds: compData.resIds
                            });

                            if (!validation.valid) {
                                Swal.fire({
                                    icon: 'warning',
                                    title: 'Instructor No Disponible',
                                    html: `<strong>${instName}</strong> no puede ser asignado a este bloque.<br><br><span class="text-xs bg-amber-50 p-2 rounded-lg border border-amber-200 block text-slate-800">${validation.message}</span>`,
                                    confirmButtonColor: '#16a34a'
                                });
                                return;
                            }

                            const key = `${zone.getAttribute('data-day')}-${zone.getAttribute('data-block')}`;
                            const existingList = scheduleState[key] || [];

                            if (existingList.length > 0) {
                                // Reemplazo directo por Drag & Drop en bloque ocupado
                                handleDragDropReplacement(zone, instId, instName, color);
                            } else {
                                // Asignación normal en bloque vacío
                                triggerAssignmentFlow(instId, instName, color, [zone]);
                            }
                        }
                    });
                }

                zone.addEventListener('click', (e) => {
                    if (e.target.closest('.btn-del-assign')) return;
                    toggleBlockSelection(zone);
                });
            });

            // Obtener conjunto de semanas ocupadas en un bloque específico
            function getOccupiedWeeksForZone(key) {
                const occupied = new Set();
                const list = scheduleState[key] || [];
                list.forEach(asn => {
                    const start = parseInt(asn.startW, 10);
                    const end = parseInt(asn.endW, 10);
                    for (let w = start; w <= end; w++) {
                        occupied.add(w);
                    }
                });
                return occupied;
            }

            // Obtener conjunto de semanas ocupadas combinadas en las zonas de destino seleccionadas
            function getOccupiedWeeksForTargetZones(targetZones) {
                const occupied = new Set();
                targetZones.forEach(zone => {
                    const key = `${zone.getAttribute('data-day')}-${zone.getAttribute('data-block')}`;
                    const zoneOccupied = getOccupiedWeeksForZone(key);
                    zoneOccupied.forEach(w => occupied.add(w));
                });
                return occupied;
            }

            // Actualizar apariencia del bloque según si está vacío, parcialmente o 12/12 semanas asignado
            function updateZoneAppearance(zone) {
                const key = `${zone.getAttribute('data-day')}-${zone.getAttribute('data-block')}`;
                const occupied = getOccupiedWeeksForZone(key);
                const count = occupied.size;
                const isSelected = zone.classList.contains('is-selected');

                const headerDiv = zone.querySelector('.flex.items-center.justify-between');
                if (!headerDiv) return;

                let badgeContainer = zone.querySelector('.week-status-badge');
                if (!badgeContainer) {
                    badgeContainer = document.createElement('span');
                    badgeContainer.className = 'week-status-badge';
                    const selectBtn = zone.querySelector('.block-select-btn');
                    if (selectBtn) {
                        headerDiv.insertBefore(badgeContainer, selectBtn);
                    } else {
                        headerDiv.appendChild(badgeContainer);
                    }
                }

                zone.classList.remove(
                    'bg-slate-50/50',
                    'bg-brand-50/60',
                    'bg-emerald-100/80',
                    'bg-emerald-50/40',
                    'border-emerald-500',
                    'border-brand-300',
                    'border-dashed',
                    'border-solid',
                    'border-slate-200'
                );

                if (count === TOTAL_TRIMESTER_WEEKS) {
                    // Bloque con las 12 semanas asignadas -> Aparece en verde esmeralda con borde sólido y badge
                    zone.classList.add('bg-emerald-100/80', 'border-emerald-500', 'border-2', 'border-solid', 'shadow-2xs');
                    badgeContainer.innerHTML = `<span class="bg-emerald-600 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-2xs animate-pop"><i data-lucide="check-circle-2" class="w-2.5 h-2.5"></i> 12/12 sem</span>`;
                } else if (count > 0) {
                    // Bloque con semanas parciales
                    zone.classList.add('bg-emerald-50/40', 'border-brand-300', 'border-2', 'border-dashed');
                    badgeContainer.innerHTML = `<span class="text-[8px] font-bold text-brand-800 bg-brand-100/90 border border-brand-300 px-1.5 py-0.5 rounded-md">${count}/12 sem</span>`;
                } else {
                    // Bloque vacío
                    zone.classList.add('border-2', 'border-dashed', 'border-slate-200');
                    if (!isSelected) {
                        zone.classList.add('bg-slate-50/50');
                    }
                    badgeContainer.innerHTML = '';
                }

                if (isSelected) {
                    zone.classList.add('ring-2', 'ring-brand-500', 'bg-brand-50/60');
                } else {
                    zone.classList.remove('ring-2', 'ring-brand-500');
                }

                if (window.lucide) lucide.createIcons();
            }

            function toggleBlockSelection(zone) {
                if (zone.classList.contains('is-selected')) {
                    zone.classList.remove('is-selected');
                    const btn = zone.querySelector('.block-select-btn');
                    if (btn) btn.innerHTML = '';
                } else {
                    zone.classList.add('is-selected');
                    const btn = zone.querySelector('.block-select-btn');
                    if (btn) btn.innerHTML = '<i data-lucide="check" class="w-2.5 h-2.5 text-brand-600"></i>';
                }
                updateZoneAppearance(zone);
                updateSelectedBlocksCount();
                updateAllInstructorsAvailability();
            }

            function unselectBlock(zone) {
                zone.classList.remove('is-selected');
                const btn = zone.querySelector('.block-select-btn');
                if (btn) btn.innerHTML = '';
                updateZoneAppearance(zone);
                updateAllInstructorsAvailability();
            }

            function updateSelectedBlocksCount() {
                const selected = document.querySelectorAll('.dropzone.is-selected');
                const badge = document.getElementById('selected-blocks-count');
                if (selected.length > 0) {
                    badge.innerText = `${selected.length} bloque(s) seleccionado(s)`;
                    badge.classList.remove('hidden');
                } else {
                    badge.classList.add('hidden');
                }
            }

            // ==========================================
            // REEMPLAZO DE INSTRUCTOR POR DRAG & DROP O SELECCIÓN DE BLOQUE
            // ==========================================
            function handleDragDropReplacement(zone, newInstId, newInstName, newColor) {
                const key = `${zone.getAttribute('data-day')}-${zone.getAttribute('data-block')}`;
                const list = scheduleState[key] || [];

                if (list.length === 0) return false;

                if (list.length === 1) {
                    const asn = list[0];
                    if (asn.instId === newInstId) {
                        Toastify({
                            text: `El instructor ${newInstName} ya está asignado a este bloque.`,
                            duration: 2500,
                            style: { background: "#64748b", borderRadius: "10px", fontSize: "12px" }
                        }).showToast();
                        return true;
                    }
                    executeRaReplacement(asn.resIds, asn.raText, asn.instId, asn.instName, newInstId, newInstName, newColor);
                    return true;
                } else {
                    const optionsHtml = list.map((asn, idx) => `
                        <option value="${idx}">
                            Sem ${asn.startW}-${asn.endW}: ${asn.instName} (${asn.raText})
                        </option>
                    `).join('');

                    Swal.fire({
                        title: 'Seleccionar Asignación a Reemplazar',
                        html: `
                            <p class="text-xs text-slate-600 mb-3">Este bloque contiene múltiples fraccionamientos. Seleccione cuál desea reemplazar por <strong>${newInstName}</strong>:</p>
                            <select id="swal-select-asn-idx" class="w-full p-2 text-xs border border-slate-300 rounded-xl bg-slate-50 focus:outline-none">
                                ${optionsHtml}
                            </select>
                        `,
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonColor: '#16a34a',
                        cancelButtonColor: '#64748b',
                        confirmButtonText: 'Continuar Reemplazo',
                        cancelButtonText: 'Cancelar'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            const selectEl = document.getElementById('swal-select-asn-idx');
                            const idx = parseInt(selectEl.value, 10);
                            const asn = list[idx];
                            if (asn) {
                                if (asn.instId === newInstId) {
                                    Toastify({
                                        text: `El instructor ${newInstName} ya está asignado a este resultado de aprendizaje.`,
                                        duration: 2500,
                                        style: { background: "#64748b", borderRadius: "10px", fontSize: "12px" }
                                    }).showToast();
                                    return;
                                }
                                executeRaReplacement(asn.resIds, asn.raText, asn.instId, asn.instName, newInstId, newInstName, newColor);
                            }
                        }
                    });
                    return true;
                }
            }

            function executeRaReplacement(targetResIds, targetRaText, oldInstId, oldInstName, newInstId, newInstName, newColor) {
                let affectedBlocksCount = 0;

                Object.keys(scheduleState).forEach(key => {
                    const list = scheduleState[key] || [];
                    const isAffected = list.some(asn => {
                        if (targetResIds && targetResIds.length > 0 && asn.resIds && asn.resIds.length > 0) {
                            return asn.resIds.some(id => targetResIds.includes(id));
                        }
                        return asn.raText === targetRaText;
                    });
                    if (isAffected) {
                        affectedBlocksCount++;
                    }
                });

                // Validar carga del nuevo instructor (RF-04)
                const currentHours = getInstructorCurrentHours(newInstId);
                const addedHours = affectedBlocksCount * 4;

                if (currentHours + addedHours > MAX_INSTRUCTOR_HOURS) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Alerta de Sobrecarga Horaria (RF-04)',
                        html: `El instructor <strong>${newInstName}</strong> excede el límite de 40h si asume todos los bloques de este RA.<br><br>Horas actuales: <strong>${currentHours}h</strong><br>Horas a agregar (${affectedBlocksCount} bloque(s)): <strong>${addedHours}h</strong><br>Total resultantes: <strong>${currentHours + addedHours}h</strong>`,
                        confirmButtonColor: '#ef4444'
                    });
                    return;
                }

                Swal.fire({
                    title: '¿Confirmar Reemplazo de Instructor?',
                    html: `Se reemplazará a <strong>${oldInstName}</strong> por <strong>${newInstName}</strong> en <strong>${affectedBlocksCount} bloque(s)</strong> donde se imparte el Resultado de Aprendizaje:<br><br><span class="text-xs bg-slate-100 p-2.5 rounded-xl border border-slate-200 block text-left text-slate-800 font-semibold">${targetRaText}</span>`,
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#16a34a',
                    cancelButtonColor: '#64748b',
                    confirmButtonText: `Sí, reemplazar en ${affectedBlocksCount} bloque(s)`,
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        Object.keys(scheduleState).forEach(key => {
                            const list = scheduleState[key] || [];
                            list.forEach(asn => {
                                let matches = false;
                                if (targetResIds && targetResIds.length > 0 && asn.resIds && asn.resIds.length > 0) {
                                    matches = asn.resIds.some(id => targetResIds.includes(id));
                                } else {
                                    matches = (asn.raText === targetRaText);
                                }

                                if (matches) {
                                    asn.instId = newInstId;
                                    asn.instName = newInstName;
                                    asn.color = newColor;
                                }
                            });

                            const [day, block] = key.split('-');
                            const zone = document.querySelector(`.dropzone[data-day="${day}"][data-block="${block}"]`);
                            if (zone) renderZoneContent(zone, key);
                        });

                        updateInstructorHoursUI(oldInstId);
                        updateInstructorHoursUI(newInstId);

                        Toastify({
                            text: `Instructor reemplazado en ${affectedBlocksCount} bloque(s) para este RA`,
                            duration: 3000,
                            style: { background: "#16a34a", borderRadius: "10px", fontSize: "12px" }
                        }).showToast();
                    }
                });
            }

            // Click en el pool de instructores (Botón Info, Botón Asignar y Selección)
            if (poolEl) {
                poolEl.addEventListener('click', (e) => {
                    // 1. Manejo del botón de información / detalles del instructor
                    const detailsBtn = e.target.closest('.btn-instructor-details');
                    if (detailsBtn) {
                        e.stopPropagation();
                        e.preventDefault();
                        const card = detailsBtn.closest('.instructor-card');
                        if (card) {
                            const instId = card.getAttribute('data-id');
                            openInstructorDetailsModal(instId);
                        }
                        return;
                    }

                    // 1b. Manejo del botón Ver Disponibilidad
                    const availabilityBtn = e.target.closest('.btn-instructor-availability');
                    if (availabilityBtn) {
                        e.stopPropagation();
                        e.preventDefault();
                        const card = availabilityBtn.closest('.instructor-card');
                        if (card) {
                            const instId = card.getAttribute('data-id');
                            openInstructorDetailsModal(instId, 'availability');
                        }
                        return;
                    }

                    // 2. Manejo del botón Asignar
                    const assignBtn = e.target.closest('.btn-assign-click');
                    if (!assignBtn) return;

                    const card = assignBtn.closest('.instructor-card');
                    if (!card) return;

                    const selectedZones = Array.from(document.querySelectorAll('.dropzone.is-selected'));
                    if (selectedZones.length === 0) {
                        Toastify({
                            text: "Por favor selecciona al menos un bloque en el horario primero.",
                            duration: 3000,
                            style: { background: "#eab308", borderRadius: "10px", fontSize: "12px" }
                        }).showToast();
                        return;
                    }

                    const instId = card.getAttribute('data-id');
                    const instName = card.getAttribute('data-name');
                    const color = card.getAttribute('data-color') || 'emerald';

                    const compData = getCheckedCompetencyResults();

                    // Validar compatibilidad y disponibilidad antes de abrir flujo
                    const validation = validateInstructorAvailability(instId, {
                        targetZones: selectedZones,
                        resIds: compData.resIds
                    });

                    if (!validation.valid) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Instructor No Disponible',
                            html: `<strong>${instName}</strong> no puede ser asignado.<br><br><span class="text-xs bg-amber-50 p-2.5 rounded-xl border border-amber-200 block text-slate-800">${validation.message}</span>`,
                            confirmButtonColor: '#16a34a'
                        });
                        return;
                    }

                    if ((!compData.resIds || compData.resIds.length === 0) && selectedZones.length === 1) {
                        const zone = selectedZones[0];
                        const key = `${zone.getAttribute('data-day')}-${zone.getAttribute('data-block')}`;
                        if ((scheduleState[key] || []).length > 0) {
                            handleDragDropReplacement(zone, instId, instName, color);
                            return;
                        }
                    }

                    triggerAssignmentFlow(instId, instName, color, selectedZones);
                });
            }

            // ==========================================
            // FLUJO DE ASIGNACIÓN Y VALIDACIONES (RF-04, RF-09, RF-10)
            // ==========================================
            function triggerAssignmentFlow(instId, instName, color, targetZones) {
                // RF-09: Validar que existan RAs seleccionados
                const compData = getCheckedCompetencyResults();
                if (!compData.resIds || compData.resIds.length === 0) {
                    Swal.fire({
                        icon: 'warning',
                        title: '¡Espera un momento!',
                        text: 'Debe seleccionar al menos un Resultado de Aprendizaje para continuar',
                        confirmButtonColor: '#16a34a'
                    });
                    return;
                }

                // Validar si los bloques seleccionados ya tienen las 12 semanas ocupadas
                const occupied = getOccupiedWeeksForTargetZones(targetZones);
                if (occupied.size >= TOTAL_TRIMESTER_WEEKS) {
                    Swal.fire({
                        icon: 'info',
                        title: 'Bloque(s) Completos',
                        text: 'Los bloques seleccionados ya tienen asignadas las 12 semanas del trimestre.',
                        confirmButtonColor: '#16a34a'
                    });
                    return;
                }

                // Validar disponibilidad completa con el motor centralizado
                const validation = validateInstructorAvailability(instId, {
                    targetZones: targetZones,
                    resIds: compData.resIds
                });

                if (!validation.valid) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Instructor No Disponible',
                        html: `<strong>${instName}</strong> no puede ser asignado.<br><br><span class="text-xs bg-amber-50 p-2.5 rounded-xl border border-amber-200 block text-slate-800">${validation.message}</span>`,
                        confirmButtonColor: '#16a34a'
                    });
                    return;
                }

                pendingAssignment = {
                    instructor: { id: instId, name: instName, color: color },
                    targetZones: targetZones,
                    startW: null,
                    endW: null,
                    raText: compData.raText,
                    resIds: compData.resIds,
                    compId: compData.compId
                };

                openFractionModal();
            }

            // ==========================================
            // MODAL FRACCIONADA DE SEMANAS (RF-10)
            // ==========================================
            function openFractionModal() {
                document.getElementById('modal-inst-name').innerText = pendingAssignment.instructor.name;
                document.getElementById('modal-ra-text').innerText = pendingAssignment.raText;

                renderModalWeeksGrid();
                updateWeekUI();
                fractionModal.classList.remove('hidden');
            }

            function renderModalWeeksGrid() {
                weeksGrid.innerHTML = '';
                const occupiedWeeks = getOccupiedWeeksForTargetZones(pendingAssignment.targetZones);

                for (let i = 1; i <= TOTAL_TRIMESTER_WEEKS; i++) {
                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.id = `btn-modal-week-${i}`;

                    if (occupiedWeeks.has(i)) {
                        btn.className = 'py-2 rounded-xl text-xs font-bold border bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed line-through opacity-60 flex items-center justify-center gap-1';
                        btn.innerHTML = `<span>Sem ${i}</span> <i data-lucide="lock" class="w-3.5 h-3.5 text-slate-400"></i>`;
                        btn.title = `La Semana ${i} ya ha sido asignada en este bloque`;
                        btn.disabled = true;
                    } else {
                        btn.className = 'py-2 rounded-xl text-xs font-bold border transition-all bg-slate-50 border-slate-200 text-slate-700 hover:border-brand-500 hover:text-brand-700 hover:bg-brand-50/50 cursor-pointer';
                        btn.innerText = `Sem ${i}`;
                        btn.onclick = () => handleWeekSelection(i);
                    }
                    weeksGrid.appendChild(btn);
                }
                if (window.lucide) lucide.createIcons();
            }

            function handleWeekSelection(weekNum) {
                const occupiedWeeks = getOccupiedWeeksForTargetZones(pendingAssignment.targetZones);
                if (occupiedWeeks.has(weekNum)) return;

                if (pendingAssignment.startW === null || (pendingAssignment.startW !== null && pendingAssignment.endW !== null)) {
                    pendingAssignment.startW = weekNum;
                    pendingAssignment.endW = null;
                } else {
                    const minW = Math.min(pendingAssignment.startW, weekNum);
                    const maxW = Math.max(pendingAssignment.startW, weekNum);

                    let hasConflict = false;
                    for (let w = minW; w <= maxW; w++) {
                        if (occupiedWeeks.has(w)) {
                            hasConflict = true;
                            break;
                        }
                    }

                    if (hasConflict) {
                        Toastify({
                            text: "El rango seleccionado incluye semanas ya asignadas.",
                            duration: 3000,
                            style: { background: "#ef4444", borderRadius: "10px", fontSize: "12px" }
                        }).showToast();
                        pendingAssignment.startW = weekNum;
                        pendingAssignment.endW = null;
                    } else {
                        pendingAssignment.startW = minW;
                        pendingAssignment.endW = maxW;
                    }
                }

                for (let i = 1; i <= TOTAL_TRIMESTER_WEEKS; i++) {
                    const btn = document.getElementById(`btn-modal-week-${i}`);
                    if (!btn || btn.disabled) continue;

                    btn.className = 'py-2 rounded-xl text-xs font-bold border transition-all bg-slate-50 border-slate-200 text-slate-700 hover:border-brand-500 hover:text-brand-700 hover:bg-brand-50/50 cursor-pointer';

                    if (pendingAssignment.startW === i && pendingAssignment.endW === null) {
                        btn.className = 'py-2 rounded-xl text-xs font-bold border transition-all bg-brand-600 border-brand-500 text-white shadow-xs';
                    } else if (pendingAssignment.startW !== null && pendingAssignment.endW !== null && i >= pendingAssignment.startW && i <= pendingAssignment.endW) {
                        btn.className = 'py-2 rounded-xl text-xs font-bold border transition-all bg-brand-600 border-brand-500 text-white shadow-xs';
                    }
                }

                updateWeekUI();
            }

            function updateWeekUI() {
                const lblStart = document.getElementById('lbl-start-w');
                const lblEnd = document.getElementById('lbl-end-w');
                const lblTotal = document.getElementById('lbl-total-w');
                const lblCount = document.getElementById('modal-weeks-count');
                const btnConfirm = document.getElementById('btn-confirm-modal');

                lblStart.innerText = pendingAssignment.startW ? `Sem ${pendingAssignment.startW}` : '-';
                lblEnd.innerText = pendingAssignment.endW ? `Sem ${pendingAssignment.endW}` : '-';

                if (pendingAssignment.startW && pendingAssignment.endW) {
                    const total = (pendingAssignment.endW - pendingAssignment.startW) + 1;
                    lblTotal.innerText = total;
                    lblCount.innerText = `${total} Semanas Seleccionadas`;
                    btnConfirm.disabled = false;
                } else {
                    lblTotal.innerText = '0';
                    lblCount.innerText = '0 Semanas Seleccionadas';
                    btnConfirm.disabled = true;
                }
            }

            document.getElementById('btn-close-modal').onclick = closeModal;
            document.getElementById('btn-cancel-modal').onclick = closeModal;

            function closeModal() {
                fractionModal.classList.add('hidden');
                pendingAssignment = { instructor: null, targetZones: [], startW: null, endW: null, raText: '', resIds: [], compId: null };
            }

            // Confirmación final de la asignación
            document.getElementById('btn-confirm-modal').onclick = () => {
                const instId = pendingAssignment.instructor.id;
                const assignedResIds = pendingAssignment.resIds || [];

                pendingAssignment.targetZones.forEach(zone => {
                    const key = `${zone.getAttribute('data-day')}-${zone.getAttribute('data-block')}`;
                    if (!scheduleState[key]) scheduleState[key] = [];

                    scheduleState[key].push({
                        instId: instId,
                        instName: pendingAssignment.instructor.name,
                        startW: pendingAssignment.startW,
                        endW: pendingAssignment.endW,
                        raText: pendingAssignment.raText,
                        color: pendingAssignment.instructor.color,
                        resIds: assignedResIds,
                        compId: pendingAssignment.compId
                    });

                    renderZoneContent(zone, key);
                    unselectBlock(zone);
                });

                // RF-01: Ocultar los RAs ya asignados
                assignedResIds.forEach(resId => {
                    const itemLabel = document.querySelector(`[data-result-id="${resId}"]`);
                    if (itemLabel) {
                        const chk = itemLabel.querySelector('.competency-check');
                        if (chk) chk.checked = false;
                        itemLabel.style.display = 'none';
                    }
                });

                updateInstructorHoursUI(instId);
                updateCompetenciesProgress();
                Toastify({
                    text: "Asignación fraccionada realizada con éxito",
                    duration: 2500,
                    style: { background: "#16a34a", borderRadius: "10px", fontSize: "12px" }
                }).showToast();

                closeModal();
            };

            function renderZoneContent(zone, key) {
                const slot = zone.querySelector('.slot-content');
                slot.innerHTML = '';
                const list = scheduleState[key] || [];

                list.sort((a, b) => a.startW - b.startW).forEach((asn, idx) => {
                    const widthPct = ((asn.endW - asn.startW + 1) / TOTAL_TRIMESTER_WEEKS) * 100;
                    const marginStartPct = ((asn.startW - 1) / TOTAL_TRIMESTER_WEEKS) * 100;

                    const el = document.createElement('div');
                    el.className = `relative w-full bg-white rounded-lg overflow-hidden border border-slate-200 h-9 group shadow-2xs`;
                    el.innerHTML = `
                        <div class="absolute top-0 bottom-0 bg-${asn.color}-100 border-l-2 border-${asn.color}-500 px-1.5 py-0.5 flex flex-col justify-center transition-all"
                             style="left: ${marginStartPct}%; width: ${widthPct}%; min-width: 35px;">
                            <div class="text-[9px] font-bold text-slate-900 truncate">S${asn.startW}-S${asn.endW} • ${asn.instName.split(' ')[0]}</div>
                            <div class="text-[8px] text-slate-600 truncate">${asn.raText}</div>
                            <button class="btn-del-assign absolute right-1 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                                    title="Eliminar esta asignación (RF-08)"
                                    onclick="removeAssignment('${key}', ${idx})">
                                <i data-lucide="x-circle" class="w-3.5 h-3.5"></i>
                            </button>
                        </div>
                    `;
                    slot.appendChild(el);
                });

                updateZoneAppearance(zone);
                updateSummaryTotals();
            }

            // ==========================================
            // ELIMINACIÓN DE ASIGNACIONES (RF-08)
            // ==========================================
            window.removeAssignment = function (key, index) {
                if (scheduleState[key]) {
                    const removed = scheduleState[key].splice(index, 1);
                    const [day, block] = key.split('-');
                    const zone = document.querySelector(`.dropzone[data-day="${day}"][data-block="${block}"]`);
                    if (zone) renderZoneContent(zone, key);

                    if (removed.length > 0) {
                        const asn = removed[0];
                        if (asn.instId) updateInstructorHoursUI(asn.instId);

                        // Habilitar nuevamente los RAs en la lista (RF-01)
                        if (asn.resIds && Array.isArray(asn.resIds)) {
                            asn.resIds.forEach(resId => {
                                const itemLabel = document.querySelector(`[data-result-id="${resId}"]`);
                                if (itemLabel) itemLabel.style.display = 'flex';
                            });
                            updateCompetenciesProgress();
                        }
                    }

                    Toastify({
                        text: "Asignación eliminada (RF-08)",
                        duration: 2000,
                        style: { background: "#64748b", borderRadius: "10px", fontSize: "12px" }
                    }).showToast();
                }
            };

            function updateInstructorHoursUI(instId) {
                const card = document.querySelector(`.instructor-card[data-id="${instId}"]`);
                if (!card) return;

                const currentHours = getInstructorCurrentHours(instId);
                const pct = Math.min(100, Math.round((currentHours / MAX_INSTRUCTOR_HOURS) * 100));

                const hoursText = card.querySelector('.hours-text');
                const hoursBar = card.querySelector('.hours-bar');
                const statusBadge = card.querySelector('.status-badge');

                if (hoursText) hoursText.innerText = `${currentHours} / 40h`;
                if (hoursBar) hoursBar.style.width = `${pct}%`;

                updateAllInstructorsAvailability();
            }

            function updateSummaryTotals() {
                let totalBlocks = 0;
                let totalHours = 0;
                Object.keys(scheduleState).forEach(k => {
                    if (scheduleState[k].length > 0) {
                        totalBlocks++;
                        totalHours += 4;
                    }
                });

                document.getElementById('total-blocks-count').innerText = `${totalBlocks} / 12`;
                document.getElementById('total-hours-count').innerText = `${totalHours} hrs`;
            }

            // ==========================================
            // REEMPLAZO DE INSTRUCTORES SIN ALTERAR RAs (RF-05)
            // ==========================================
            if (btnGlobalSwap) {
                btnGlobalSwap.addEventListener('click', () => {
                    populateSwapSelects();
                    swapModal.classList.remove('hidden');
                });
            }

            function populateSwapSelects() {
                const oldSelect = document.getElementById('swap-select-old-inst');
                const newSelect = document.getElementById('swap-select-new-inst');

                oldSelect.innerHTML = '<option value="">-- Seleccionar Instructor Saliente --</option>';
                newSelect.innerHTML = '<option value="">-- Seleccionar Nuevo Instructor --</option>';

                // Obtener instructores con asignaciones activas
                const assignedInstIds = new Set();
                Object.values(scheduleState).forEach(list => {
                    list.forEach(a => assignedInstIds.add(a.instId));
                });

                document.querySelectorAll('.instructor-card').forEach(card => {
                    const id = card.getAttribute('data-id');
                    const name = card.getAttribute('data-name');

                    if (assignedInstIds.has(id)) {
                        const opt = document.createElement('option');
                        opt.value = id;
                        opt.innerText = `${name} (Con Asignaciones)`;
                        oldSelect.appendChild(opt);
                    }

                    const optNew = document.createElement('option');
                    optNew.value = id;
                    optNew.innerText = name;
                    newSelect.appendChild(optNew);
                });

                document.getElementById('btn-confirm-swap-modal').disabled = true;
            }

            const oldSelect = document.getElementById('swap-select-old-inst');
            const newSelect = document.getElementById('swap-select-new-inst');

            function checkSwapValidity() {
                const oldId = oldSelect.value;
                const newId = newSelect.value;
                const btnConfirm = document.getElementById('btn-confirm-swap-modal');
                btnConfirm.disabled = !(oldId && newId && oldId !== newId);
            }

            oldSelect.onchange = checkSwapValidity;
            newSelect.onchange = checkSwapValidity;

            document.getElementById('btn-close-swap-modal').onclick = () => swapModal.classList.add('hidden');
            document.getElementById('btn-cancel-swap-modal').onclick = () => swapModal.classList.add('hidden');

            document.getElementById('btn-confirm-swap-modal').onclick = () => {
                const oldId = oldSelect.value;
                const newId = newSelect.value;
                const newCard = document.querySelector(`.instructor-card[data-id="${newId}"]`);
                const newName = newCard ? newCard.getAttribute('data-name') : 'Instructor';
                const newColor = newCard ? newCard.getAttribute('data-color') : 'emerald';

                let count = 0;
                Object.keys(scheduleState).forEach(key => {
                    scheduleState[key].forEach(asn => {
                        if (asn.instId === oldId) {
                            asn.instId = newId;
                            asn.instName = newName;
                            asn.color = newColor;
                            count++;
                        }
                    });

                    const [day, block] = key.split('-');
                    const zone = document.querySelector(`.dropzone[data-day="${day}"][data-block="${block}"]`);
                    if (zone) renderZoneContent(zone, key);
                });

                updateInstructorHoursUI(oldId);
                updateInstructorHoursUI(newId);

                swapModal.classList.add('hidden');
                Swal.fire({
                    icon: 'success',
                    title: 'Reemplazo Exitoso (RF-05)',
                    text: `Se reemplazó el instructor en ${count} bloque(s). Los Resultados de Aprendizaje se mantuvieron intactos.`,
                    confirmButtonColor: '#16a34a'
                });
            };



            //  COMPARACIÓN DE FICHAS - VERSIÓN REACTIVA Y ROBUSTA

            // Variables globales para el modo edición dentro del modal
            let editingFichaId = null;
            const selectedBlocksForEdit = {};  // { fichaId: Set(blockKey) }

            // ==========================================
            // SISTEMA CENTRALIZADO DE CÁLCULO DE TRIMESTRES (AÑO Y PROGRAMA)
            // ==========================================

            // Configuración de duración de programas (excluyendo los 2 trimestres de Etapa Productiva)
            const PROGRAM_TRIMESTER_CONFIG = {
                adso: { totalTrimestres: 9, lectivaTrimestres: 7, productivaTrimestres: 2, type: 'Tecnología' },
                multimedia: { totalTrimestres: 9, lectivaTrimestres: 7, productivaTrimestres: 2, type: 'Tecnología' },
                redes: { totalTrimestres: 9, lectivaTrimestres: 7, productivaTrimestres: 2, type: 'Tecnología' },
                enfermeria: { totalTrimestres: 6, lectivaTrimestres: 4, productivaTrimestres: 2, type: 'Técnico' },
                negociacion: { totalTrimestres: 9, lectivaTrimestres: 7, productivaTrimestres: 2, type: 'Tecnología' }
            };

            // Mapeo automático de trimestres por fase lectiva según la duración lectiva del programa
            const PHASE_TRIMESTER_MAP = {
                7: {
                    analisis: { trimestres: [1, 2], label: 'Trimestres 1 - 2 (de 7 lectivos)', defaultTrim: 1 },
                    planeacion: { trimestres: [3, 4], label: 'Trimestres 3 - 4 (de 7 lectivos)', defaultTrim: 3 },
                    ejecucion: { trimestres: [5, 6], label: 'Trimestres 5 - 6 (de 7 lectivos)', defaultTrim: 5 },
                    evaluacion: { trimestres: [7], label: 'Trimestre 7 (de 7 lectivos)', defaultTrim: 7 }
                },
                4: {
                    analisis: { trimestres: [1], label: 'Trimestre 1 (de 4 lectivos)', defaultTrim: 1 },
                    planeacion: { trimestres: [2], label: 'Trimestre 2 (de 4 lectivos)', defaultTrim: 2 },
                    ejecucion: { trimestres: [3], label: 'Trimestre 3 (de 4 lectivos)', defaultTrim: 3 },
                    evaluacion: { trimestres: [4], label: 'Trimestre 4 (de 4 lectivos)', defaultTrim: 4 }
                }
            };

            // Catálogo completo de fichas del sistema (programa + jornada + fecha inicio)
            const FICHAS_CATALOG = [
                // ADSO
                { id: '3237741', program: 'adso', jornada: 'diurna', programLabel: 'ADSO', jornadaLabel: 'Diurna', startDate: '2026-01-15' },
                { id: '3237742', program: 'adso', jornada: 'nocturna', programLabel: 'ADSO', jornadaLabel: 'Nocturna', startDate: '2026-04-01' },
                // Multimedia
                { id: '2184491', program: 'multimedia', jornada: 'diurna', programLabel: 'Multimedia', jornadaLabel: 'Diurna', startDate: '2025-10-01' },
                { id: '2184492', program: 'multimedia', jornada: 'nocturna', programLabel: 'Multimedia', jornadaLabel: 'Nocturna', startDate: '2026-01-15' },
                // Redes
                { id: '1982345', program: 'redes', jornada: 'diurna', programLabel: 'Redes', jornadaLabel: 'Diurna', startDate: '2026-01-15' },
                { id: '1982346', program: 'redes', jornada: 'nocturna', programLabel: 'Redes', jornadaLabel: 'Nocturna', startDate: '2026-04-01' },
                // Enfermería
                { id: '3237750', program: 'enfermeria', jornada: 'diurna', programLabel: 'Enfermería', jornadaLabel: 'Diurna', startDate: '2025-10-01' },
                { id: '3237751', program: 'enfermeria', jornada: 'nocturna', programLabel: 'Enfermería', jornadaLabel: 'Nocturna', startDate: '2026-01-15' },
                // Negociación Internacional
                { id: '3237752', program: 'negociacion', jornada: 'diurna', programLabel: 'Negociación Internacional', jornadaLabel: 'Diurna', startDate: '2026-01-15' },
                { id: '3237753', program: 'negociacion', jornada: 'nocturna', programLabel: 'Negociación Internacional', jornadaLabel: 'Nocturna', startDate: '2026-04-01' }
            ];

            // 1. Obtener información del Trimestre del Año (Calendario)
            function getCalendarQuarterInfo(date = new Date()) {
                const month = date.getMonth(); // 0 a 11
                const year = date.getFullYear();
                const qNum = Math.floor(month / 3) + 1;
                const ranges = { 1: 'Ene-Mar', 2: 'Abr-Jun', 3: 'Jul-Sep', 4: 'Oct-Dic' };

                return {
                    quarter: qNum,
                    year: year,
                    shortTag: `T${qNum}-${year}`,
                    label: `${qNum}° Trimestre del año (${year})`,
                    fullLabel: `${qNum}° Trimestre (${ranges[qNum]}) ${year}`
                };
            }

            // 2. Obtener información completa de trimestres para una ficha y fase
            function getFichaTrimesterDetails(fichaId, currentPhaseKey = null, refDate = new Date()) {
                const catalogEntry = FICHAS_CATALOG.find(item => item.id === fichaId);
                const meta = getCompareFichaMeta(fichaId);
                const programKey = meta.program || (catalogEntry ? catalogEntry.program : 'adso');
                const config = PROGRAM_TRIMESTER_CONFIG[programKey] || { totalTrimestres: 9, lectivaTrimestres: 7, productivaTrimestres: 2, type: 'Tecnología' };

                const calInfo = getCalendarQuarterInfo(refDate);

                // Determinar fase activa (si no se pasa, leer del DOM o de localStorage)
                let phaseKey = currentPhaseKey;
                if (!phaseKey && fichaId === getActiveFichaId()) {
                    phaseKey = document.getElementById('select-fase-ficha')?.value || 'analisis';
                }
                if (!phaseKey) {
                    const snapshot = getFichaSnapshot(fichaId);
                    phaseKey = snapshot.fase || 'analisis';
                }

                // Cálculo basado en fecha de inicio si existe
                let calculatedTrimestre = null;
                const startDateStr = catalogEntry?.startDate || '2026-01-15';
                if (startDateStr) {
                    const start = new Date(startDateStr);
                    const diffMonths = (refDate.getFullYear() - start.getFullYear()) * 12 + (refDate.getMonth() - start.getMonth());
                    calculatedTrimestre = Math.max(1, Math.floor(diffMonths / 3) + 1);
                }

                // Mapeo por fase activa
                const mapLectiva = PHASE_TRIMESTER_MAP[config.lectivaTrimestres] || PHASE_TRIMESTER_MAP[7];
                const phaseConfig = mapLectiva[phaseKey] || mapLectiva['analisis'];

                let currentLectivoNum = calculatedTrimestre || phaseConfig.defaultTrim;
                let isProductiva = false;

                if (currentLectivoNum > config.lectivaTrimestres) {
                    isProductiva = true;
                }

                let programQuarterLabel = '';
                let programQuarterShort = '';

                if (isProductiva) {
                    const prodNum = currentLectivoNum - config.lectivaTrimestres;
                    programQuarterLabel = `Etapa Productiva (Trim ${prodNum}/${config.productivaTrimestres})`;
                    programQuarterShort = `Productiva T${prodNum}`;
                } else {
                    programQuarterLabel = `${currentLectivoNum}° Trimestre Lectivo (${currentLectivoNum}/${config.lectivaTrimestres})`;
                    programQuarterShort = `${currentLectivoNum}° Trim (Lectiva ${currentLectivoNum}/${config.lectivaTrimestres})`;
                }

                return {
                    fichaId: fichaId,
                    programKey: programKey,
                    programType: config.type,
                    totalTrimestres: config.totalTrimestres,
                    lectivaTrimestres: config.lectivaTrimestres,
                    productivaTrimestres: config.productivaTrimestres,
                    phaseKey: phaseKey,
                    phaseTrimesterLabel: phaseConfig.label,
                    calendarQuarterTag: calInfo.shortTag,
                    calendarQuarterLabel: calInfo.fullLabel,
                    currentLectivoNum: currentLectivoNum,
                    isProductiva: isProductiva,
                    programQuarterLabel: programQuarterLabel,
                    programQuarterShort: programQuarterShort
                };
            }

            // Actualizar la interfaz del Header con los datos de trimestre de la Ficha Activa
            function updateActiveFichaTrimesterUI() {
                const activeId = getActiveFichaId();
                const activePhase = document.getElementById('select-fase-ficha')?.value || 'analisis';
                const info = getFichaTrimesterDetails(activeId, activePhase);

                const yearEl = document.getElementById('ficha-year-trimester-display');
                const progEl = document.getElementById('ficha-program-trimester-display');

                if (yearEl) {
                    yearEl.innerText = info.calendarQuarterTag;
                    yearEl.setAttribute('title', `Año Calendario: ${info.calendarQuarterLabel}`);
                }
                if (progEl) {
                    progEl.innerText = info.programQuarterShort;
                    progEl.setAttribute('title', `Duración Lectiva: ${info.lectivaTrimestres} trimestres | Fase: ${info.phaseTrimesterLabel}`);
                }
            }

            // ==========================================
            // CÁLCULO Y ALMACÉN DE HISTORIAL DE PROGRAMACIONES POR FICHA (SOLO CONSULTA)
            // ==========================================

            const HISTORICAL_SCHEDULES_STORE = {
                '3237741': [
                    {
                        period: 'Periodo 2025-4 (Histórico)',
                        periodLabel: 'Trimestre 2 Lectivo • Periodo 2025-4 (Oct - Dic 2025)',
                        phaseKey: 'analisis',
                        phaseLabel: 'Fase 1: Análisis',
                        assignments: [
                            {
                                day: 'LUN',
                                block: 'Bloque 1',
                                time: '06:00 - 10:00',
                                compId: '220501093',
                                compTitle: '220501093 - Evaluar requisitos de la solución de software',
                                raId: 'res-101',
                                raText: 'Modelar las funciones del software de acuerdo con el informe de requisitos',
                                instId: 'inst-1',
                                instName: 'German Ramírez',
                                area: 'Análisis & Metodologías de Desarrollo'
                            },
                            {
                                day: 'MAR',
                                block: 'Bloque 2',
                                time: '10:00 - 14:00',
                                compId: '240201524',
                                compTitle: '240201524 - Promover la cultura de paz con base en principios éticos',
                                raId: 'res-201',
                                raText: 'Promover la cultura de paz con base en principios éticos',
                                instId: 'inst-2',
                                instName: 'Lizeth Giraldo',
                                area: 'Transversal - Ética, Paz & Emprendimiento'
                            },
                            {
                                day: 'VIE',
                                block: 'Bloque 2',
                                time: '10:00 - 14:00',
                                compId: '240202501',
                                compTitle: '240202501 - Interactuar en lengua inglesa de forma oral y escrita',
                                raId: 'res-301',
                                raText: 'Comprender información sobre situaciones cotidianas y laborales actuales',
                                instId: 'inst-3',
                                instName: 'Mónica Laverde',
                                area: 'Transversal - Bilingüismo & Inglés Técnico'
                            }
                        ]
                    },
                    {
                        period: 'Periodo 2025-3 (Histórico)',
                        periodLabel: 'Trimestre 1 Lectivo • Periodo 2025-3 (Jul - Sep 2025)',
                        phaseKey: 'analisis',
                        phaseLabel: 'Fase 1: Análisis',
                        assignments: [
                            {
                                day: 'MIE',
                                block: 'Bloque 1',
                                time: '06:00 - 10:00',
                                compId: '220501093',
                                compTitle: '220501093 - Evaluar requisitos de la solución de software',
                                raId: 'res-102',
                                raText: 'Planear actividades de análisis de acuerdo con la metodología seleccionada',
                                instId: 'inst-4',
                                instName: 'Juan Camilo Martínez',
                                area: 'Algoritmos, TIC & Desarrollo Backend'
                            },
                            {
                                day: 'JUE',
                                block: 'Bloque 2',
                                time: '10:00 - 14:00',
                                compId: '220501093',
                                compTitle: '220501093 - Evaluar requisitos de la solución de software',
                                raId: 'res-103',
                                raText: 'Verificar los modelos realizados en la fase de análisis',
                                instId: 'inst-1',
                                instName: 'German Ramírez',
                                area: 'Análisis & Metodologías de Desarrollo'
                            }
                        ]
                    }
                ],
                '2184491': [
                    {
                        period: 'Periodo 2025-4 (Histórico)',
                        periodLabel: 'Trimestre 3 Lectivo • Periodo 2025-4 (Oct - Dic 2025)',
                        phaseKey: 'planeacion',
                        phaseLabel: 'Fase 2: Planeación',
                        assignments: [
                            {
                                day: 'LUN',
                                block: 'Bloque 2',
                                time: '10:00 - 14:00',
                                compId: '220501094',
                                compTitle: '220501094 - Diseñar la solución de software',
                                raId: 'res-402',
                                raText: 'Diseñar la interfaz de usuario UI/UX según prototipos',
                                instId: 'inst-1',
                                instName: 'German Ramírez',
                                area: 'Análisis & Metodologías de Desarrollo'
                            }
                        ]
                    }
                ],
                '1982345': [
                    {
                        period: 'Periodo 2025-4 (Histórico)',
                        periodLabel: 'Trimestre 2 Lectivo • Periodo 2025-4 (Oct - Dic 2025)',
                        phaseKey: 'analisis',
                        phaseLabel: 'Fase 1: Análisis',
                        assignments: [
                            {
                                day: 'MAR',
                                block: 'Bloque 1',
                                time: '06:00 - 10:00',
                                compId: '240201524',
                                compTitle: '240201524 - Promover la cultura de paz',
                                raId: 'res-201',
                                raText: 'Promover la cultura de paz con base en principios éticos',
                                instId: 'inst-2',
                                instName: 'Lizeth Giraldo',
                                area: 'Transversal - Ética, Paz & Emprendimiento'
                            }
                        ]
                    }
                ],
                '3237750': [
                    {
                        period: 'Periodo 2025-3 (Histórico)',
                        periodLabel: 'Trimestre 3 Lectivo • Periodo 2025-3 (Jul - Sep 2025)',
                        phaseKey: 'planeacion',
                        phaseLabel: 'Fase 2: Planeación',
                        assignments: [
                            {
                                day: 'JUE',
                                block: 'Bloque 2',
                                time: '10:00 - 14:00',
                                compId: '240201526',
                                compTitle: '240201526 - Tecnologías de la Información TIC',
                                raId: 'res-501',
                                raText: 'Optimizar procesos de trabajo mediante herramientas digitales',
                                instId: 'inst-4',
                                instName: 'Juan Camilo Martínez',
                                area: 'Algoritmos, TIC & Desarrollo Backend'
                            }
                        ]
                    }
                ]
            };

            let currentActiveHistoryFichaId = null;

            function getFichaHistoryData(fichaId) {
                let list = HISTORICAL_SCHEDULES_STORE[fichaId] ? JSON.parse(JSON.stringify(HISTORICAL_SCHEDULES_STORE[fichaId])) : [];

                // Agregar programaciones históricas adicionales guardadas en localStorage si existen
                const storedHist = localStorage.getItem(`kronos_history_${fichaId}`);
                if (storedHist) {
                    try {
                        const parsedHist = JSON.parse(storedHist);
                        if (Array.isArray(parsedHist)) {
                            parsedHist.forEach(p => {
                                if (!list.some(item => item.period === p.period)) {
                                    list.push(p);
                                }
                            });
                        }
                    } catch (e) { }
                }

                // Complementar con historicalSchedules definidos en INSTRUCTORS_DATA
                Object.values(INSTRUCTORS_DATA).forEach(inst => {
                    if (inst.historicalSchedules && Array.isArray(inst.historicalSchedules)) {
                        inst.historicalSchedules.forEach(h => {
                            if (h.fichaId === fichaId) {
                                let periodEntry = list.find(p => p.period === h.period);
                                if (!periodEntry) {
                                    periodEntry = {
                                        period: h.period,
                                        periodLabel: `${h.period}`,
                                        phaseKey: 'analisis',
                                        phaseLabel: 'Fase 1: Análisis',
                                        assignments: []
                                    };
                                    list.push(periodEntry);
                                }
                                const exists = periodEntry.assignments.some(a => a.day === h.day && a.block === h.block && a.instId === inst.id);
                                if (!exists) {
                                    periodEntry.assignments.push({
                                        day: h.day,
                                        block: h.block,
                                        time: h.time || '06:00 - 10:00',
                                        compId: '220501093',
                                        compTitle: 'Competencia Formativa Registrada',
                                        raId: 'res-general',
                                        raText: h.raText,
                                        instId: inst.id,
                                        instName: inst.name,
                                        area: inst.area
                                    });
                                }
                            }
                        });
                    }
                });

                return list;
            }

            function openFichaHistoryModal(fichaId) {
                const targetFicha = fichaId || getActiveFichaId();
                currentActiveHistoryFichaId = targetFicha;

                const meta = getCompareFichaMeta(targetFicha);
                const titleEl = document.getElementById('modal-history-title');
                const subEl = document.getElementById('modal-history-subtitle');

                if (titleEl) titleEl.innerText = `Historial de Programaciones • Ficha ${targetFicha}`;
                if (subEl) subEl.innerText = `${meta.programLabel} (${meta.jornadaLabel}) • Registro de Trimestres Finalizados (Solo Lectura)`;

                renderFichaHistoryContent(targetFicha, 'ALL');

                const modal = document.getElementById('ficha-history-modal');
                if (modal) {
                    modal.classList.remove('hidden');
                }
            }

            function closeFichaHistoryModal() {
                const modal = document.getElementById('ficha-history-modal');
                if (modal) {
                    modal.classList.add('hidden');
                }
            }

            function renderFichaHistoryContent(fichaId, periodFilter = 'ALL') {
                const container = document.getElementById('modal-history-content-container');
                const selectEl = document.getElementById('modal-history-trimester-select');
                const countBadge = document.getElementById('modal-history-count-badge');
                if (!container) return;

                const historyList = getFichaHistoryData(fichaId);

                // Poblar select de períodos si no coincide
                if (selectEl) {
                    let optionsHtml = `<option value="ALL">Todos los Trimestres Anteriores (${historyList.length})</option>`;
                    historyList.forEach((item) => {
                        optionsHtml += `<option value="${item.period}" ${periodFilter === item.period ? 'selected' : ''}>${item.periodLabel || item.period}</option>`;
                    });
                    selectEl.innerHTML = optionsHtml;
                    selectEl.onchange = (e) => {
                        renderFichaHistoryContent(fichaId, e.target.value);
                    };
                }

                if (historyList.length === 0) {
                    container.innerHTML = `
                        <div class="border border-dashed border-slate-300 rounded-2xl bg-slate-50/80 p-8 text-center space-y-3 my-4">
                            <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 border border-indigo-100 flex items-center justify-center mx-auto shadow-2xs">
                                <i data-lucide="history" class="w-6 h-6"></i>
                            </div>
                            <div class="space-y-1">
                                <h4 class="text-sm font-bold text-slate-800">Sin Registros Históricos Previos</h4>
                                <p class="text-xs text-slate-500 max-w-md mx-auto">No se registran programaciones finalizadas en trimestres anteriores para la <strong>Ficha ${fichaId}</strong>. Las programaciones pasadas se irán archivando automáticamente al finalizar cada período académico.</p>
                            </div>
                            <span class="inline-flex items-center gap-1 text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full font-semibold">
                                <i data-lucide="info" class="w-3.5 h-3.5"></i> Trimestre Actual (Periodo 2026-1) en proceso de asignación
                            </span>
                        </div>
                    `;
                    if (countBadge) countBadge.innerText = '0 registros pasados';
                    if (window.lucide) lucide.createIcons();
                    return;
                }

                let filteredList = historyList;
                if (periodFilter !== 'ALL') {
                    filteredList = historyList.filter(item => item.period === periodFilter);
                }

                let totalAssignmentsCount = 0;

                let html = filteredList.map(p => {
                    const phaseTitle = PHASES_DATA[p.phaseKey]?.title || p.phaseLabel || 'Fase de Formación';
                    const asnList = p.assignments || [];
                    totalAssignmentsCount += asnList.length;

                    const rowsHtml = asnList.map(asn => {
                        const dayLabel = DAY_LABELS[asn.day] || asn.day;
                        const blockTime = BLOCK_TIME_LABELS[asn.block] || asn.time || 'Horario Programado';

                        return `
                            <tr class="hover:bg-slate-50/80 transition-colors border-b border-slate-100 last:border-0 text-xs">
                                <td class="px-3 py-2.5 whitespace-nowrap font-bold text-slate-800">
                                    <div class="flex items-center gap-1.5">
                                        <span class="bg-indigo-100 text-indigo-900 border border-indigo-200 px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase">${dayLabel.substring(0,3)}</span>
                                        <span class="text-slate-600 text-[11px] font-medium">${asn.block} (${blockTime})</span>
                                    </div>
                                </td>
                                <td class="px-3 py-2.5 text-slate-700">
                                    <div class="font-semibold text-slate-900 text-[11px]">${asn.compTitle}</div>
                                    <span class="text-[10px] text-slate-400 font-medium">Cód: ${asn.compId}</span>
                                </td>
                                <td class="px-3 py-2.5 text-slate-800 font-medium text-[11px]">
                                    <div class="line-clamp-2" title="${asn.raText}">${asn.raText}</div>
                                </td>
                                <td class="px-3 py-2.5 whitespace-nowrap">
                                    <div class="flex items-center gap-2">
                                        <div class="w-6 h-6 rounded-full bg-brand-100 text-brand-800 font-bold text-[10px] flex items-center justify-center border border-brand-200 shrink-0">
                                            ${asn.instName ? asn.instName.split(' ').map(n=>n[0]).join('').substring(0,2) : 'IN'}
                                        </div>
                                        <div class="flex flex-col leading-tight">
                                            <span class="font-bold text-slate-900 text-[11px]">${asn.instName}</span>
                                            <span class="text-[9px] text-slate-400">${asn.area}</span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        `;
                    }).join('');

                    return `
                        <div class="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs space-y-0">
                            <!-- Header de Trimestre Anterior -->
                            <div class="bg-slate-100/90 px-4 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                                <div class="flex items-center gap-2">
                                    <span class="bg-indigo-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Histórico</span>
                                    <h4 class="font-extrabold text-slate-900 text-xs">${p.periodLabel || p.period}</h4>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="bg-brand-50 text-brand-900 border border-brand-200 font-bold text-[10px] px-2 py-0.5 rounded-full">${phaseTitle}</span>
                                    <span class="text-[11px] font-semibold text-slate-500">${asnList.length} RA(s) impartidos</span>
                                </div>
                            </div>

                            <!-- Tabla de asignaciones -->
                            <div class="overflow-x-auto">
                                <table class="w-full text-left border-collapse">
                                    <thead>
                                        <tr class="bg-slate-50/70 border-b border-slate-200 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                                            <th class="px-3 py-2">Horario / Bloque</th>
                                            <th class="px-3 py-2">Competencia</th>
                                            <th class="px-3 py-2">Resultado de Aprendizaje (RA)</th>
                                            <th class="px-3 py-2">Instructor Impartidor</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${rowsHtml}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    `;
                }).join('');

                container.innerHTML = html;
                if (countBadge) countBadge.innerText = `${totalAssignmentsCount} registros pasados`;
                if (window.lucide) lucide.createIcons();
            }

            window.openFichaHistoryModal = openFichaHistoryModal;
            window.closeFichaHistoryModal = closeFichaHistoryModal;

            function getCompareFichaMeta(fichaId) {
                const catalogEntry = FICHAS_CATALOG.find(item => item.id === fichaId);
                if (catalogEntry) {
                    return {
                        program: catalogEntry.program,
                        jornada: catalogEntry.jornada,
                        programLabel: catalogEntry.programLabel,
                        jornadaLabel: catalogEntry.jornadaLabel
                    };
                }
                const raw = localStorage.getItem(`kronos_schedule_${fichaId}`);
                if (raw) {
                    try {
                        const data = JSON.parse(raw);
                        const programLabels = { adso: 'ADSO', multimedia: 'Multimedia', redes: 'Redes' };
                        const jornadaLabels = { diurna: 'Diurna', nocturna: 'Nocturna' };
                        return {
                            program: data.program || 'adso',
                            jornada: data.jornada || 'diurna',
                            programLabel: programLabels[data.program] || data.program || 'ADSO',
                            jornadaLabel: jornadaLabels[data.jornada] || data.jornada || 'Diurna'
                        };
                    } catch (e) { }
                }
                return { program: 'adso', jornada: 'diurna', programLabel: 'ADSO', jornadaLabel: 'Diurna' };
            }

            function buildEmptyFichaSnapshot(fichaId) {
                const totalBlocks = dropzones.length;
                return {
                    fichaId: fichaId,
                    program: 'adso',
                    jornada: 'diurna',
                    fase: 'analisis',
                    scheduleState: {},
                    hiddenResIds: [],
                    isGridComplete: false,
                    fullBlocks: 0,
                    totalBlocks: totalBlocks,
                    totalAssignedWeeks: 0,
                    totalPossibleWeeks: totalBlocks * TOTAL_TRIMESTER_WEEKS,
                    savedAt: null,
                    isLiveSnapshot: false,
                    hasSavedData: false
                };
            }

            function buildCurrentFichaSnapshot() {
                const fichaId = getActiveFichaId();
                const gridStatus = getScheduleGridCompletionStatus();
                return {
                    fichaId: fichaId,
                    program: document.getElementById('select-program')?.value || 'adso',
                    jornada: document.getElementById('select-jornada')?.value || 'diurna',
                    fase: document.getElementById('select-fase-ficha')?.value || 'analisis',
                    scheduleState: JSON.parse(JSON.stringify(scheduleState)),
                    hiddenResIds: [],
                    isGridComplete: gridStatus.isGridComplete,
                    fullBlocks: gridStatus.fullBlocks,
                    totalBlocks: gridStatus.totalBlocks,
                    totalAssignedWeeks: gridStatus.totalAssignedWeeks,
                    totalPossibleWeeks: gridStatus.totalPossibleWeeks,
                    savedAt: null,
                    isLiveSnapshot: true,
                    hasSavedData: true
                };
            }

            function calculateGridStatusFromState(state) {
                let fullBlocks = 0;
                let totalAssignedWeeks = 0;
                const totalBlocks = dropzones.length;

                dropzones.forEach(zone => {
                    const key = `${zone.getAttribute('data-day')}-${zone.getAttribute('data-block')}`;
                    const list = state[key] || [];
                    const occupied = new Set();
                    list.forEach(asn => {
                        const start = parseInt(asn.startW, 10);
                        const end = parseInt(asn.endW, 10);
                        for (let w = start; w <= end; w++) occupied.add(w);
                    });
                    const count = occupied.size;
                    totalAssignedWeeks += count;
                    if (count === TOTAL_TRIMESTER_WEEKS) fullBlocks++;
                });

                return { fullBlocks, totalBlocks, totalAssignedWeeks, isGridComplete: fullBlocks === totalBlocks };
            }

            function getFichaSnapshot(fichaId) {
                if (fichaId === getActiveFichaId()) {
                    return buildCurrentFichaSnapshot();
                }
                const raw = localStorage.getItem(`kronos_schedule_${fichaId}`);
                if (!raw) return buildEmptyFichaSnapshot(fichaId);
                try {
                    const parsed = JSON.parse(raw);
                    const meta = getCompareFichaMeta(fichaId);
                    const gridStatus = calculateGridStatusFromState(parsed.scheduleState || {});
                    return {
                        fichaId: fichaId,
                        program: parsed.program || meta.program,
                        jornada: parsed.jornada || meta.jornada,
                        fase: parsed.fase || 'analisis',
                        scheduleState: parsed.scheduleState || {},
                        hiddenResIds: parsed.hiddenResIds || [],
                        isGridComplete: gridStatus.isGridComplete,
                        fullBlocks: gridStatus.fullBlocks,
                        totalBlocks: gridStatus.totalBlocks,
                        totalAssignedWeeks: gridStatus.totalAssignedWeeks,
                        totalPossibleWeeks: gridStatus.totalBlocks * TOTAL_TRIMESTER_WEEKS,
                        savedAt: parsed.savedAt || null,
                        isLiveSnapshot: false,
                        hasSavedData: true
                    };
                } catch (e) {
                    return buildEmptyFichaSnapshot(fichaId);
                }
            }

            function getAvailableFichas() {
                // Devuelve únicamente las fichas definidas en el catálogo FICHAS_CATALOG
                // (5 programas × 2 jornadas = 10 fichas exactas)
                return FICHAS_CATALOG;
            }

            function renderCompareFichaOptions() {
                const container = document.getElementById('compare-fichas-options');
                if (!container) return;

                // Obtener filtros
                const filterSelect = document.getElementById('compare-fichas-jornada-filter');
                const filterValue = filterSelect ? filterSelect.value : 'todas';
                const searchInput = document.getElementById('compare-fichas-search');
                const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';

                // Aplicar filtro de jornada
                let fichasFiltradas = FICHAS_CATALOG;
                if (filterValue === 'diurna') {
                    fichasFiltradas = FICHAS_CATALOG.filter(f => f.jornada === 'diurna');
                } else if (filterValue === 'nocturna') {
                    fichasFiltradas = FICHAS_CATALOG.filter(f => f.jornada === 'nocturna');
                }

                // Aplicar filtro de búsqueda (por ID o por nombre del programa)
                if (searchTerm !== '') {
                    fichasFiltradas = fichasFiltradas.filter(item => {
                        const idMatch = item.id.toLowerCase().includes(searchTerm);
                        const programMatch = item.program.toLowerCase().includes(searchTerm);
                        const labelMatch = item.programLabel.toLowerCase().includes(searchTerm);
                        return idMatch || programMatch || labelMatch;
                    });
                }

                const activeId = getActiveFichaId();

                // Si no hay resultados, mostrar mensaje
                if (fichasFiltradas.length === 0) {
                    container.innerHTML = `<div class="text-xs text-slate-500 w-full text-center py-2">No se encontraron fichas que coincidan con la búsqueda.</div>`;
                    return;
                }

                // Generar chips con nombre del programa + número de ficha
                container.innerHTML = fichasFiltradas.map(item => {
                    // Determinar si se debe mostrar ícono de jornada (solo cuando el filtro es 'todas')
                    let iconHtml = '';
                    if (filterValue === 'todas') {
                        if (item.jornada === 'diurna') {
                            iconHtml = `<i data-lucide="sun" class="w-3.5 h-3.5 text-amber-500 shrink-0"></i>`;
                        } else if (item.jornada === 'nocturna') {
                            iconHtml = `<i data-lucide="moon" class="w-3.5 h-3.5 text-indigo-500 shrink-0"></i>`;
                        }
                    }

                    return `
            <label class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer text-xs font-medium text-slate-700 whitespace-nowrap">
                <input type="checkbox" value="${item.id}" class="compare-ficha-check rounded border-slate-300 text-brand-600 focus:ring-brand-500 accent-brand-600 w-3.5 h-3.5" ${item.id === activeId ? 'checked' : ''}>
                <div class="flex flex-col leading-tight">
                    <span class="text-xs font-bold text-slate-900">${item.programLabel}</span>
                    <span class="text-[9px] text-slate-500">${item.id}</span>
                </div>
                ${iconHtml}
            </label>
        `;
                }).join('');

                // Desmarcar checkboxes que ya no están visibles (por filtro)
                const allVisibleIds = new Set(fichasFiltradas.map(f => f.id));
                container.querySelectorAll('.compare-ficha-check').forEach(input => {
                    if (!allVisibleIds.has(input.value)) {
                        input.checked = false;
                    }
                });

                // Asignar evento a los checkboxes (igual que antes)
                container.querySelectorAll('.compare-ficha-check').forEach(input => {
                    input.addEventListener('change', function () {
                        const checked = document.querySelectorAll('.compare-ficha-check:checked');
                        if (checked.length > 4) {
                            this.checked = false;
                            Toastify({
                                text: "Máximo 4 fichas seleccionadas.",
                                duration: 2000,
                                style: { background: "#eab308", borderRadius: "10px", fontSize: "12px" }
                            }).showToast();
                        } else {
                            renderCompareFichaPanels();
                        }
                    });
                });

                // Renderizar íconos de lucide (para sol/luna)
                if (window.lucide) lucide.createIcons();
            }
            function renderCompareFichaPanels() {
                const checked = Array.from(document.querySelectorAll('.compare-ficha-check:checked')).map(c => c.value);
                const countEl = document.getElementById('compare-fichas-selection-count');
                const emptyState = document.getElementById('compare-fichas-empty-state');
                const panelsContainer = document.getElementById('compare-fichas-panels');

                if (!panelsContainer || !emptyState) return;

                if (countEl) {
                    countEl.innerText = `${checked.length} ficha${checked.length === 1 ? '' : 's'} seleccionada${checked.length === 1 ? '' : 's'}`;
                }

                if (countEl) {
                    const filterValue = document.getElementById('compare-fichas-jornada-filter').value;
                    const text = `${checked.length} ficha${checked.length === 1 ? '' : 's'} seleccionada${checked.length === 1 ? '' : 's'}`;

                    if (filterValue === 'diurna') {
                        countEl.innerHTML = `
            <div class="flex flex-col items-center leading-tight">
                <i data-lucide="sun" class="text-amber-500 w-4 h-4"></i>
                <span>${text}</span>
            </div>
        `;
                    } else if (filterValue === 'nocturna') {
                        countEl.innerHTML = `
            <div class="flex flex-col items-center leading-tight">
                <i data-lucide="moon" class="text-indigo-500 w-4 h-4"></i>
                <span>${text}</span>
            </div>
        `;
                    } else {
                        countEl.innerText = text;
                    }
                }

                emptyState.classList.add('hidden');
                panelsContainer.classList.remove('hidden');

                const selected = checked.slice(0, 4);
                if (checked.length > 4) {
                    Toastify({
                        text: "Solo se muestran las primeras 4 fichas.",
                        duration: 3000,
                        style: { background: "#eab308", borderRadius: "10px", fontSize: "12px" }
                    }).showToast();
                }

                // DÍAS SIN ACENTOS PARA COINCIDIR CON data-day DEL DOM
                const days = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];
                const blocks = ['Bloque 1', 'Bloque 2'];
                const blockLabels = {
                    'Bloque 1': '06:00-10:00',
                    'Bloque 2': '10:00-14:00'
                };
                const dayDisplay = {
                    'LUN': 'LUN',
                    'MAR': 'MAR',
                    'MIE': 'MIÉ',
                    'JUE': 'JUE',
                    'VIE': 'VIE',
                    'SAB': 'SÁB'
                };

                const firstInst = document.querySelector('.instructor-card');
                const defaultInstId = firstInst ? firstInst.getAttribute('data-id') : '';
                const defaultInstName = firstInst ? firstInst.getAttribute('data-name') : 'Instructor';

                panelsContainer.innerHTML = selected.map(fichaId => {
                    const snapshot = getFichaSnapshot(fichaId);
                    const meta = getCompareFichaMeta(fichaId);
                    const phaseTitle = PHASES_DATA[snapshot.fase]?.title || snapshot.fase || 'Sin fase';
                    const isEditing = (editingFichaId === fichaId);
                    const selectedBlocks = selectedBlocksForEdit[fichaId] || new Set();

                    let gridHtml = '';
                    gridHtml += `<div class="grid grid-cols-6 gap-1 text-[10px] font-bold text-slate-600 bg-slate-100/80 p-1 rounded-t-lg">`;
                    days.forEach(d => gridHtml += `<div class="text-center py-0.5">${dayDisplay[d]}</div>`);
                    gridHtml += `</div>`;

                    blocks.forEach(block => {
                        gridHtml += `<div class="grid grid-cols-6 gap-1">`;
                        days.forEach(day => {
                            const key = `${day}-${block}`;
                            const assignments = (snapshot.scheduleState && snapshot.scheduleState[key]) || [];
                            const has = assignments.length > 0;
                            const selected = isEditing && selectedBlocks.has(key);

                            let content = '';
                            if (has) {
                                const asn = assignments[0];
                                const name = asn.instName || 'Instructor';
                                const ra = asn.raText || 'RA';
                                const short = ra.length > 20 ? ra.substring(0, 20) + '…' : ra;
                                const extra = assignments.length > 1 ? ` +${assignments.length - 1}` : '';
                                content = `
                        <span class="leading-tight text-center">${name}</span>
                        <span class="text-[7px] text-brand-700 leading-tight text-center">${short}${extra}</span>
                    `;
                            } else {
                                content = `<span class="text-[8px] text-slate-400">—</span>`;
                            }

                            const clickAttr = isEditing ? `onclick="toggleBlockSelectionInCard('${fichaId}','${key}')"` : '';
                            const selClass = selected ? 'ring-2 ring-brand-500 bg-brand-50/60' : '';
                            const hasClass = has ? 'bg-brand-100 border-brand-300' : 'border-dashed border-slate-300 bg-slate-50/50';
                            const cursor = isEditing ? 'cursor-pointer' : '';

                            gridHtml += `
                    <div class="border rounded-md p-0.5 text-[8px] font-semibold text-brand-900 flex flex-col items-center justify-center min-h-[40px] relative group ${hasClass} ${selClass} ${cursor}" ${clickAttr}>
                        ${content}
                        <div class="absolute inset-0 bg-brand-200/10 rounded-md pointer-events-none"></div>
                    </div>
                `;
                        });
                        gridHtml += `</div>`;
                    });

                    const labels = blocks.map(b => `<span class="text-[8px] font-semibold text-slate-500">${blockLabels[b]}</span>`).join(' · ');

                    let actions = '';
                    if (isEditing) {
                        const count = selectedBlocks.size;
                        actions = `
                <div class="mt-2 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-2">
                    <span class="text-[10px] font-medium text-slate-500">${count} bloque(s) seleccionado(s)</span>
                    <span class="text-[10px] font-medium text-slate-600">Instructor: ${defaultInstName}</span>
                                <button onclick="goToFicha('${fichaId}')"
                    class="text-[10px] font-bold px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-all flex items-center gap-1">
                <i data-lucide="eye" class="w-3.5 h-3.5"></i>
                Ir a la ficha
            </button>
                    <button onclick="removeAssignmentsFromBlocks('${fichaId}')"
                            class="text-[10px] font-bold px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            ${count === 0 ? 'disabled' : ''}>
                        Eliminar
                    </button>
                    <button onclick="toggleEditFicha('${fichaId}')" class="text-[10px] font-semibold text-slate-500 hover:text-slate-700 underline">
                        Cerrar edición
                    </button>
                </div>
            `;
                    }

                    const cardClass = `
            bg-white rounded-xl border-2 shadow-sm overflow-hidden flex flex-col transition-all duration-200
            ${isEditing ? 'scale-105 z-20 border-brand-500 shadow-xl ring-2 ring-brand-500/30' : 'border-slate-200'}
        `;

                    // ⬇️ AQUÍ SE MODIFICA EL ENCABEZADO DE LA TARJETA
                    const trimInfo = getFichaTrimesterDetails(fichaId, snapshot.fase);

                    return `
            <div class="${cardClass}">
                <div class="px-3 py-2 border-b border-slate-100 bg-slate-50 flex flex-col gap-1.5">
                    <div class="flex flex-wrap items-center justify-between gap-1">
                        <div class="flex items-center gap-2">
                            <div class="flex flex-col leading-tight">
                                <span class="text-xs font-extrabold text-slate-900">${meta.programLabel}</span>
                                <span class="text-[10px] text-slate-500 font-medium">Ficha ${fichaId}</span>
                            </div>
                            <span class="text-[10px] font-medium text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded-full">${meta.jornadaLabel}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-[10px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">${phaseTitle}</span>
                            <button onclick="toggleEditFicha('${fichaId}')" class="p-1 rounded hover:bg-brand-100 transition-colors">
                                <i data-lucide="pencil" class="w-3.5 h-3.5 ${isEditing ? 'text-brand-600' : 'text-slate-400'}"></i>
                            </button>
                        </div>
                    </div>
                    <!-- Badges de Trimestre del Año y del Programa para esta ficha -->
                    <div class="flex items-center gap-1.5 text-[9px] font-bold flex-wrap">
                        <span class="bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded" title="Trimestre del año calendario (Fecha actual)">
                            Año: ${trimInfo.calendarQuarterTag}
                        </span>
                        <span class="bg-brand-100 text-brand-900 border border-brand-300 px-1.5 py-0.2 rounded" title="Trimestre dentro de la etapa lectiva del programa (${trimInfo.lectivaTrimestres} trimestres lectivos)">
                            ${trimInfo.programQuarterShort}
                        </span>
                    </div>
                </div>
                <div class="p-2 space-y-1">
                    <div class="text-[8px] text-slate-400 font-medium flex justify-between">
                        <span>${labels}</span>
                        <span>${snapshot.fullBlocks}/${snapshot.totalBlocks} bloques completos</span>
                    </div>
                    ${gridHtml}
                    ${actions}
                </div>
            </div>
        `;
                }).join('');

                if (window.lucide) lucide.createIcons();
            }
            function openCompareFichasModal() {
                const modal = document.getElementById('compare-fichas-modal');
                if (!modal) {
                    console.error('Modal con id "compare-fichas-modal" no encontrado');
                    return;
                }
                editingFichaId = null;
                Object.keys(selectedBlocksForEdit).forEach(k => selectedBlocksForEdit[k].clear());
                renderCompareFichaOptions();
                renderCompareFichaPanels();
                modal.classList.remove('hidden');
            }

            function closeCompareFichasModal() {
                const modal = document.getElementById('compare-fichas-modal');
                if (modal) modal.classList.add('hidden');
                editingFichaId = null;
                Object.keys(selectedBlocksForEdit).forEach(k => selectedBlocksForEdit[k].clear());
            }

            function toggleEditFicha(fichaId) {
                if (editingFichaId === fichaId) {
                    editingFichaId = null;
                    if (selectedBlocksForEdit[fichaId]) selectedBlocksForEdit[fichaId].clear();
                } else {
                    if (editingFichaId && selectedBlocksForEdit[editingFichaId]) {
                        selectedBlocksForEdit[editingFichaId].clear();
                    }
                    editingFichaId = fichaId;
                    if (!selectedBlocksForEdit[fichaId]) selectedBlocksForEdit[fichaId] = new Set();
                }
                renderCompareFichaPanels();
            }

            function toggleBlockSelectionInCard(fichaId, blockKey) {
                if (editingFichaId !== fichaId) return;
                if (!selectedBlocksForEdit[fichaId]) selectedBlocksForEdit[fichaId] = new Set();
                const set = selectedBlocksForEdit[fichaId];
                if (set.has(blockKey)) set.delete(blockKey);
                else set.add(blockKey);
                renderCompareFichaPanels();
            }

            function assignInstructorToBlocks(fichaId, instructorId, blockKeys) {
                if (!blockKeys || blockKeys.length === 0) {
                    Toastify({ text: "No hay bloques seleccionados.", duration: 2000, style: { background: "#eab308", borderRadius: "10px", fontSize: "12px" } }).showToast();
                    return;
                }
                const card = document.querySelector(`.instructor-card[data-id="${instructorId}"]`);
                if (!card) {
                    Toastify({ text: "Instructor no encontrado", duration: 2000, style: { background: "#ef4444", borderRadius: "10px", fontSize: "12px" } }).showToast();
                    return;
                }
                const instName = card.getAttribute('data-name') || 'Instructor';
                const color = card.getAttribute('data-color') || 'emerald';

                let data;
                if (fichaId === getActiveFichaId()) {
                    data = {
                        fichaId: fichaId,
                        program: document.getElementById('select-program')?.value || 'adso',
                        jornada: document.getElementById('select-jornada')?.value || 'diurna',
                        fase: document.getElementById('select-fase-ficha')?.value || 'analisis',
                        scheduleState: JSON.parse(JSON.stringify(scheduleState)),
                        hiddenResIds: []
                    };
                } else {
                    const raw = localStorage.getItem(`kronos_schedule_${fichaId}`);
                    if (!raw) {
                        data = {
                            fichaId: fichaId,
                            program: 'adso',
                            jornada: 'diurna',
                            fase: 'analisis',
                            scheduleState: {},
                            hiddenResIds: []
                        };
                    } else {
                        try { data = JSON.parse(raw); } catch (e) { data = { scheduleState: {} }; }
                    }
                }

                const newAssignment = {
                    instId: instructorId,
                    instName: instName,
                    startW: 1,
                    endW: TOTAL_TRIMESTER_WEEKS,
                    raText: 'Asignación desde comparación',
                    color: color,
                    resIds: [],
                    compId: null
                };

                blockKeys.forEach(key => {
                    if (!data.scheduleState[key]) data.scheduleState[key] = [];
                    data.scheduleState[key] = [JSON.parse(JSON.stringify(newAssignment))];
                });

                const gridStatus = calculateGridStatusFromState(data.scheduleState);
                data.fullBlocks = gridStatus.fullBlocks;
                data.totalBlocks = gridStatus.totalBlocks;
                data.totalAssignedWeeks = gridStatus.totalAssignedWeeks;
                data.isGridComplete = gridStatus.isGridComplete;
                data.savedAt = new Date().toISOString();

                localStorage.setItem(`kronos_schedule_${fichaId}`, JSON.stringify(data));

                if (fichaId === getActiveFichaId()) {
                    loadScheduleFromStorage(true);
                }
                renderCompareFichaPanels();

                Toastify({
                    text: `Asignado a ${blockKeys.length} bloque(s) en Ficha ${fichaId}`,
                    duration: 3000,
                    style: { background: "#16a34a", borderRadius: "10px", fontSize: "12px" }
                }).showToast();
            }

            function removeAssignmentsFromBlocks(fichaId) {
                const blockKeys = (selectedBlocksForEdit[fichaId] && selectedBlocksForEdit[fichaId].size > 0)
                    ? Array.from(selectedBlocksForEdit[fichaId])
                    : [];

                if (blockKeys.length === 0) {
                    Toastify({ text: "No hay bloques seleccionados para eliminar.", duration: 2000, style: { background: "#eab308", borderRadius: "10px", fontSize: "12px" } }).showToast();
                    return;
                }

                Swal.fire({
                    title: '¿Eliminar asignaciones?',
                    html: `Se eliminarán las asignaciones de <strong>${blockKeys.length} bloque(s)</strong>. Esta acción es irreversible.`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#ef4444',
                    cancelButtonColor: '#64748b',
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        let data;
                        if (fichaId === getActiveFichaId()) {
                            data = {
                                fichaId: fichaId,
                                program: document.getElementById('select-program')?.value || 'adso',
                                jornada: document.getElementById('select-jornada')?.value || 'diurna',
                                fase: document.getElementById('select-fase-ficha')?.value || 'analisis',
                                scheduleState: JSON.parse(JSON.stringify(scheduleState)),
                                hiddenResIds: []
                            };
                        } else {
                            const raw = localStorage.getItem(`kronos_schedule_${fichaId}`);
                            if (!raw) {
                                Toastify({ text: "No hay datos guardados para esta ficha.", duration: 2000, style: { background: "#ef4444", borderRadius: "10px", fontSize: "12px" } }).showToast();
                                return;
                            }
                            try { data = JSON.parse(raw); } catch (e) { data = { scheduleState: {} }; }
                        }

                        blockKeys.forEach(key => delete data.scheduleState[key]);

                        const gridStatus = calculateGridStatusFromState(data.scheduleState);
                        data.fullBlocks = gridStatus.fullBlocks;
                        data.totalBlocks = gridStatus.totalBlocks;
                        data.totalAssignedWeeks = gridStatus.totalAssignedWeeks;
                        data.isGridComplete = gridStatus.isGridComplete;
                        data.savedAt = new Date().toISOString();

                        localStorage.setItem(`kronos_schedule_${fichaId}`, JSON.stringify(data));

                        if (fichaId === getActiveFichaId()) {
                            loadScheduleFromStorage(true);
                        }

                        if (selectedBlocksForEdit[fichaId]) selectedBlocksForEdit[fichaId].clear();
                        renderCompareFichaPanels();

                        Toastify({
                            text: `Eliminadas asignaciones de ${blockKeys.length} bloque(s)`,
                            duration: 3000,
                            style: { background: "#16a34a", borderRadius: "10px", fontSize: "12px" }
                        }).showToast();
                    }
                });
            }

            function goToFicha(fichaId) {
                const meta = getCompareFichaMeta(fichaId);
                const progSelect = document.getElementById('select-program');
                const jorSelect = document.getElementById('select-jornada');

                if (progSelect) progSelect.value = meta.program;
                if (jorSelect) jorSelect.value = meta.jornada;

                if (typeof updateFichaIdFromSelects === 'function') {
                    updateFichaIdFromSelects();
                }

                closeCompareFichasModal();

                Toastify({
                    text: `Dirigiendo a la ficha ${fichaId}...`,
                    duration: 2500,
                    style: { background: "#16a34a", borderRadius: "10px", fontSize: "12px" }
                }).showToast();
            }

            window.goToFicha = goToFicha;

            // ASIGNACIÓN DE EVENTOS PARA EL MODAL
            const btnCompare = document.getElementById('btn-compare-fichas');
            if (btnCompare) {
                btnCompare.addEventListener('click', openCompareFichasModal);
            } else {
                console.warn('Botón "Comparar fichas" no encontrado');
            }

            const closeModalBtns = [
                document.getElementById('btn-close-compare-fichas-modal'),
                document.getElementById('btn-close-compare-fichas-footer')
            ];
            closeModalBtns.forEach(btn => {
                if (btn) btn.addEventListener('click', closeCompareFichasModal);

            });

            const jornadaFilter = document.getElementById('compare-fichas-jornada-filter');
            if (jornadaFilter) {
                jornadaFilter.addEventListener('change', function () {
                    renderCompareFichaOptions();
                    renderCompareFichaPanels();
                });
            }

            // Evento para el buscador de fichas
            const searchInput = document.getElementById('compare-fichas-search');
            if (searchInput) {
                searchInput.addEventListener('input', function () {
                    renderCompareFichaOptions();   // actualiza los chips visibles
                    renderCompareFichaPanels();    // actualiza los paneles (los no seleccionados se ocultan)
                });
            }

            window.toggleEditFicha = toggleEditFicha;
            window.toggleBlockSelectionInCard = toggleBlockSelectionInCard;
            window.assignInstructorToBlocks = assignInstructorToBlocks;
            window.removeAssignmentsFromBlocks = removeAssignmentsFromBlocks;
            window.openCompareFichasModal = openCompareFichasModal;
            window.closeCompareFichasModal = closeCompareFichasModal;

            console.log('Sección de comparación de fichas cargada correctamente.');


            // ALERTAS CRÍTICAS Y GUARDADO INCOMPLETO (RF-14, RF-15)

            if (btnClearAll) {
                btnClearAll.addEventListener('click', () => {
                    Swal.fire({
                        title: '¿Borrar la programación?',
                        html: `
                            <div style="margin-top: 10px;">
                                <label style="display:flex; align-items:center; gap:8px; justify-content:center; cursor:pointer;">
                                    <input type="checkbox" id="swal-clear-checkbox" style="width:16px; height:16px;">
                                    <span>Comprendo que se eliminarán las horas programadas</span>
                                </label>
                            </div>
                        `,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#ef4444',
                        cancelButtonColor: '#16a34a',
                        confirmButtonText: 'Eliminar',
                        cancelButtonText: 'Mantener',
                        allowOutsideClick: false,
                        didOpen: (modal) => {
                            // Renderizar íconos Lucide dentro del modal (para la papelera)
                            if (window.lucide) {
                                lucide.createIcons(modal);
                            }
                            const confirmBtn = modal.querySelector('.swal2-confirm');
                            const checkbox = modal.querySelector('#swal-clear-checkbox');
                            if (confirmBtn && checkbox) {
                                confirmBtn.disabled = true;
                                checkbox.addEventListener('change', function () {
                                    confirmBtn.disabled = !this.checked;
                                });
                            }
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            const instIds = new Set();
                            Object.keys(scheduleState).forEach(key => {
                                (scheduleState[key] || []).forEach(a => instIds.add(a.instId));
                                delete scheduleState[key];
                            });

                            // Eliminar datos guardados en localStorage para la ficha activa
                            const activeFicha = getActiveFichaId();
                            const storageKey = `kronos_schedule_${activeFicha}`;
                            localStorage.removeItem(storageKey);

                            dropzones.forEach(zone => {
                                const key = `${zone.getAttribute('data-day')}-${zone.getAttribute('data-block')}`;
                                renderZoneContent(zone, key);
                                unselectBlock(zone);
                            });

                            document.querySelectorAll('.competency-item').forEach(lbl => {
                                lbl.style.display = 'flex';
                                const chk = lbl.querySelector('.competency-check');
                                if (chk) chk.checked = false;
                            });

                            instIds.forEach(id => updateInstructorHoursUI(id));
                            updateCompetenciesProgress();
                            updateSummaryTotals();
                            updateSelectedBlocksCount();
                            // Actualizar lista de asignaciones incompletas
                            renderIncompleteAssignments();

                            Toastify({
                                text: "Toda la malla horaria ha sido despejada.",
                                duration: 3000,
                                style: { background: "#ef4444", borderRadius: "10px", fontSize: "12px" }
                            }).showToast();
                        }
                    });
                });
            }

            // ==========================================
            // PERSISTENCIA Y CARGA DE PROGRAMACIÓN POR FICHA (RF-15)
            // ==========================================
            function getActiveFichaId() {
                const fichaEl = document.getElementById('ficha-number-display');
                return fichaEl ? fichaEl.innerText.trim() : '3237741';
            }

            function saveCurrentScheduleToStorage() {
                const fichaId = getActiveFichaId();
                const storageKey = `kronos_schedule_${fichaId}`;

                const gridStatus = getScheduleGridCompletionStatus();
                const hiddenResIds = [];
                Object.values(scheduleState).forEach(list => {
                    list.forEach(asn => {
                        if (asn.resIds && Array.isArray(asn.resIds)) {
                            asn.resIds.forEach(id => {
                                if (!hiddenResIds.includes(id)) hiddenResIds.push(id);
                            });
                        }
                    });
                });

                const dataToSave = {
                    fichaId: fichaId,
                    program: document.getElementById('select-program')?.value || 'adso',
                    jornada: document.getElementById('select-jornada')?.value || 'diurna',
                    fase: document.getElementById('select-fase-ficha')?.value || 'analisis',
                    scheduleState: scheduleState,
                    hiddenResIds: hiddenResIds,
                    isGridComplete: gridStatus.isGridComplete,
                    fullBlocks: gridStatus.fullBlocks,
                    totalBlocks: gridStatus.totalBlocks,
                    totalAssignedWeeks: gridStatus.totalAssignedWeeks,
                    savedAt: new Date().toISOString()
                };

                localStorage.setItem(storageKey, JSON.stringify(dataToSave));
                return dataToSave;
            }

            function loadScheduleFromStorage(silent = false) {
                const fichaId = getActiveFichaId();
                const storageKey = `kronos_schedule_${fichaId}`;
                const raw = localStorage.getItem(storageKey);

                const activePhase = document.getElementById('select-fase-ficha')?.value || 'analisis';
                renderCompetenciesForPhase(activePhase);

                // Resetear estado actual en memoria
                Object.keys(scheduleState).forEach(k => delete scheduleState[k]);

                if (!raw) {
                    dropzones.forEach(zone => {
                        const zKey = `${zone.getAttribute('data-day')}-${zone.getAttribute('data-block')}`;
                        renderZoneContent(zone, zKey);
                        unselectBlock(zone);
                    });
                    document.querySelectorAll('.instructor-card').forEach(card => {
                        const id = card.getAttribute('data-id');
                        updateInstructorHoursUI(id);
                    });
                    updateCompetenciesProgress();
                    updateSummaryTotals();
                    updateSelectedBlocksCount();
                    return false;
                }

                try {
                    const data = JSON.parse(raw);
                    if (data.scheduleState) {
                        Object.assign(scheduleState, data.scheduleState);
                    }

                    // Renderizar los bloques guardados
                    dropzones.forEach(zone => {
                        const zKey = `${zone.getAttribute('data-day')}-${zone.getAttribute('data-block')}`;
                        renderZoneContent(zone, zKey);
                        unselectBlock(zone);
                    });

                    // Re-renderizar RAs para la fase activa de modo que oculte RAs asignados
                    renderCompetenciesForPhase(activePhase);

                    // Actualizar indicadores y carga horaria
                    document.querySelectorAll('.instructor-card').forEach(card => {
                        const id = card.getAttribute('data-id');
                        updateInstructorHoursUI(id);
                    });
                    updateCompetenciesProgress();
                    updateSummaryTotals();
                    updateSelectedBlocksCount();

                    const gridStatus = getScheduleGridCompletionStatus();

                    if (!silent) {
                        if (gridStatus.isGridComplete) {
                            Swal.fire({
                                icon: 'success',
                                title: `Programación Completa Cargada`,
                                html: `Los <strong>12 bloques de la parrilla horaria</strong> de la Ficha <strong>${fichaId}</strong> están 100% asignados.`,
                                confirmButtonColor: '#16a34a',
                                timer: 3000
                            });
                        }
                    }
                    return true;
                } catch (err) {
                    console.error("Error al cargar la programación guardada:", err);
                    return false;
                }
            }

            function updateFichaIdFromSelects() {
                const prog = document.getElementById('select-program')?.value || 'adso';
                const jor = document.getElementById('select-jornada')?.value || 'diurna';

                let id = '3237741';
                if (prog === 'adso' && jor === 'diurna') id = '3237741';
                else if (prog === 'adso' && jor === 'nocturna') id = '3237742';
                else if (prog === 'multimedia' && jor === 'diurna') id = '2184491';
                else if (prog === 'multimedia' && jor === 'nocturna') id = '2184492';
                else if (prog === 'redes' && jor === 'diurna') id = '1982345';
                else if (prog === 'redes' && jor === 'nocturna') id = '1982346';
                else if (prog === 'enfermeria' && jor === 'diurna') id = '3237750';
                else if (prog === 'enfermeria' && jor === 'nocturna') id = '3237751';
                else if (prog === 'negociacion' && jor === 'diurna') id = '3237752';
                else if (prog === 'negociacion' && jor === 'nocturna') id = '3237753';

                const fichaEl = document.getElementById('ficha-number-display');
                if (fichaEl) fichaEl.innerText = id;

                loadScheduleFromStorage(false);
            }

            function handleSaveButtonClick() {
                const gridStatus = getScheduleGridCompletionStatus();
                const fichaId = getActiveFichaId();

                if (!gridStatus.isGridComplete) {
                    const missingBlocks = gridStatus.totalBlocks - gridStatus.fullBlocks;

                    Swal.fire({
                        title: 'Asignación Incompleta',
                        html: `
                            <div class="space-y-3 text-xs text-slate-700 text-left">
                                <p>El horario de la Ficha <strong>${fichaId}</strong> aún no está completamente asignada.</p>
                                <div class="bg-amber-50 p-3 rounded-xl border border-amber-200 space-y-1.5">
                                    <div class="flex justify-between font-bold text-amber-900">
                                        <span>Bloques Completados:</span>
                                        <span>${gridStatus.fullBlocks} / ${gridStatus.totalBlocks}</span>
                                    </div>
                                    <div class="flex justify-between font-medium text-amber-800">
                                        <span>Bloques Incompletos / Vacíos:</span>
                                        <span>${missingBlocks} bloque(s)</span>
                                    </div>
                                    <div class="flex justify-between font-medium text-amber-800">
                                        <span>Semanas Cubiertas:</span>
                                        <span>${gridStatus.totalAssignedWeeks} / ${gridStatus.totalPossibleWeeks} sem-bloque</span>
                                    </div>
                                </div>
                                <p class="font-semibold text-slate-800">¿Desea guardar la programación actual en su estado borrador incompleto?</p>
                            </div>
                        `,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#16a34a',
                        cancelButtonColor: '#64748b',
                        confirmButtonText: 'Guardar borrador',
                        cancelButtonText: 'Seguir editando'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            saveCurrentScheduleToStorage();
                            Swal.fire({
                                title: 'Borrador guardado',
                                iconHtml: '<i data-lucide="save" class="w-12 h-12 text-emerald-600"></i>',
                                html: `Borrador de la ficha ${fichaId} guardado.`,
                                confirmButtonColor: '#16a34a',
                                didOpen: () => {
                                    if (window.lucide) lucide.createIcons();
                                }
                            });
                            renderIncompleteAssignments();

                        }
                    });
                } else {
                    saveCurrentScheduleToStorage();
                    Swal.fire({
                        icon: 'success',
                        title: '¡Programación Completa Guardada!',
                        html: `Los <strong>12 bloques de la parrilla horaria</strong> de la Ficha <strong>${fichaId}</strong> han sido asignados correctamente al 100%.`,
                        confirmButtonColor: '#16a34a'
                    });
                }
            }

            /**
* Renderiza las fichas guardadas en localStorage que NO están completas.
* Cada tarjeta muestra programa, ficha, porcentaje y un botón "Ir" para cargar esa ficha.
*/
            function renderIncompleteAssignments() {
                const container = document.getElementById('incomplete-assignments-container');
                const list = document.getElementById('incomplete-list');
                const badge = document.getElementById('incomplete-badge');
                if (!container || !list) return;

                const incomplete = [];

                // Recorrer localStorage en busca de claves que empiecen con "kronos_schedule_"
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith('kronos_schedule_')) {
                        try {
                            const raw = localStorage.getItem(key);
                            const data = JSON.parse(raw);
                            // Verificar si está incompleta
                            if (data.isGridComplete !== true && (data.fullBlocks > 0) && (data.fullBlocks < data.totalBlocks)) {
                                incomplete.push(data);
                            }
                        } catch (e) {
                            // Si hay error de parseo, ignorar
                        }
                    }
                }

                // Ordenar por porcentaje ascendente
                incomplete.sort((a, b) => {
                    const pctA = Math.round((a.fullBlocks / a.totalBlocks) * 100);
                    const pctB = Math.round((b.fullBlocks / b.totalBlocks) * 100);
                    return pctA - pctB;
                });

                // Actualizar badge
                if (badge) {
                    badge.textContent = incomplete.length;
                }

                // Mantener el panel visible e indicar cuando no hay registros incompletos
                if (incomplete.length === 0) {
                    list.innerHTML = '<p class="text-xs text-slate-500">No hay asignaciones incompletas.</p>';
                    return;
                }

                // Generar las tarjetas con el botón "Ir"
                list.innerHTML = incomplete.map(data => {
                    const meta = getCompareFichaMeta(data.fichaId);
                    const pct = Math.round((data.fullBlocks / data.totalBlocks) * 100);
                    const programLabel = meta.programLabel || data.program || 'Programa';
                    const fichaId = data.fichaId || 'Desconocida';
                    const trimInfo = getFichaTrimesterDetails(fichaId, data.fase);

                    return `
            <div class="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs flex items-center justify-between hover:border-amber-300 transition-all">
                <div class="flex flex-col space-y-0.5">
                    <div class="flex items-center gap-1.5">
                        <span class="text-xs font-bold text-slate-900">${programLabel}</span>
                        <span class="text-[9px] font-bold text-amber-900 bg-amber-100 border border-amber-300 px-1.5 py-0.2 rounded" title="Trimestre del año">${trimInfo.calendarQuarterTag}</span>
                    </div>
                    <div class="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                        <span>Ficha ${fichaId}</span>
                        <span>•</span>
                        <span class="text-brand-800 font-bold">${trimInfo.programQuarterShort}</span>
                    </div>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                    <button onclick="openFichaHistoryModal('${fichaId}')"
                            class="text-[10px] font-bold px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-lg transition-all flex items-center gap-1 shrink-0" title="Ver historial de esta ficha">
                        <i data-lucide="history" class="w-3.5 h-3.5 text-indigo-600"></i>
                        Historial
                    </button>
                    <button onclick="goToFicha('${fichaId}')"
                            class="text-[10px] font-bold px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-all flex items-center gap-1 shrink-0">
                        <i data-lucide="eye" class="w-3.5 h-3.5"></i>
                        Ir
                    </button>
                </div>
            </div>
        `;
                }).join('');

                // Renderizar íconos Lucide (para el ojo)
                if (window.lucide) {
                    lucide.createIcons();
                }
            }

            if (btnSaveSchedule) btnSaveSchedule.addEventListener('click', handleSaveButtonClick);
            const btnSaveSec = document.getElementById('btn-save-schedule-sec');
            if (btnSaveSec) btnSaveSec.addEventListener('click', handleSaveButtonClick);

            const selectFase = document.getElementById('select-fase-ficha');
            if (selectFase) {
                selectFase.addEventListener('change', (e) => {
                    const phaseKey = e.target.value;
                    renderCompetenciesForPhase(phaseKey);
                    updateActiveFichaTrimesterUI();
                });
            }

            ['select-program', 'select-jornada'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.addEventListener('change', () => {
                    updateFichaIdFromSelects();
                    updateActiveFichaTrimesterUI();
                });
            });

            // Eventos para el Modal de Historial
            const btnViewActiveHistory = document.getElementById('btn-view-active-history');
            if (btnViewActiveHistory) {
                btnViewActiveHistory.addEventListener('click', () => {
                    openFichaHistoryModal(getActiveFichaId());
                });
            }

            const btnCloseHistoryModal = document.getElementById('btn-close-ficha-history-modal');
            if (btnCloseHistoryModal) btnCloseHistoryModal.addEventListener('click', closeFichaHistoryModal);

            const btnCloseHistoryFooter = document.getElementById('btn-close-ficha-history-footer');
            if (btnCloseHistoryFooter) btnCloseHistoryFooter.addEventListener('click', closeFichaHistoryModal);

            // Inicializar y sembrar programaciones activas predeterminadas en otras fichas
            initializeDefaultCrossFicheSchedules();

            // Cargar automáticamente la programación al ingresar a la ficha / cargar la página
            loadScheduleFromStorage(false);
            requestAnimationFrame(renderIncompleteAssignments);
            updateAllInstructorsAvailability();
            updateActiveFichaTrimesterUI();

            // Seleccionar / Deseleccionar Todos los Bloques (RF-06)
            if (btnSelectAll) {
                btnSelectAll.addEventListener('click', () => {
                    const selectedCount = document.querySelectorAll('.dropzone.is-selected').length;
                    const allSelected = selectedCount === dropzones.length;

                    dropzones.forEach(zone => {
                        if (allSelected) {
                            zone.classList.remove('is-selected');
                            const btn = zone.querySelector('.block-select-btn');
                            if (btn) btn.innerHTML = '';
                        } else {
                            zone.classList.add('is-selected');
                            const btn = zone.querySelector('.block-select-btn');
                            if (btn) btn.innerHTML = '<i data-lucide="check" class="w-2.5 h-2.5 text-brand-600"></i>';
                        }
                        updateZoneAppearance(zone);
                    });
                    updateSelectedBlocksCount();
                    updateAllInstructorsAvailability();
                });
            }

            // Buscador de Instructores (RF-13)
            if (searchInstructorInput && poolEl) {
                searchInstructorInput.addEventListener('input', (e) => {
                    const term = e.target.value.toLowerCase().trim();
                    poolEl.querySelectorAll('.instructor-card').forEach(card => {
                        const name = (card.getAttribute('data-name') || '').toLowerCase();
                        card.style.display = name.includes(term) ? 'block' : 'none';
                    });
                });
            }

            // Buscador de Competencias / RAs (RF-13)
            if (searchCompetenciesInput) {
                searchCompetenciesInput.addEventListener('input', (e) => {
                    const term = e.target.value.toLowerCase().trim();
                    document.querySelectorAll('.competency-card').forEach(card => {
                        const text = card.innerText.toLowerCase();
                        card.style.display = text.includes(term) ? 'block' : 'none';
                    });
                });
            }
  }
}
