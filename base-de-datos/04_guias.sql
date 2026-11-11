-- =====================================================================
-- 04_guias.sql - Guías de capacitación (Persona 3)
-- Fuente: Documento Maestro de Información AcreditaTech 2026
--   (secciones 2.3, 3.3, 4.3 y 5.3). 40 guías: 5 técnicas + 5 de salud por oficio.
-- Ejecutar en Supabase > SQL Editor. Se puede correr más de una vez
-- (actualiza las guías existentes, no las duplica).
-- =====================================================================

BEGIN;

-- 1. Columnas nuevas en ctutorial
ALTER TABLE ctutorial
  ADD COLUMN IF NOT EXISTS codigo              varchar(10),   -- E-G1, P-G6...
  ADD COLUMN IF NOT EXISTS codigo_tema         varchar(10),   -- E-T1, P-S3... (liga con las preguntas)
  ADD COLUMN IF NOT EXISTS infografia_sugerida text;

-- 2. Evita guías duplicadas
CREATE UNIQUE INDEX IF NOT EXISTS ux_tutorial_oficio_codigo
  ON ctutorial (id_oficio, codigo);

-- 3. Las 40 guías
-- columnas: id_tipo_evaluacion (1 técnica, 2 salud), id_oficio, codigo, codigo_tema,
--           tema (nombre legible), titulo, contenido_multimedia, infografia_sugerida
INSERT INTO ctutorial
  (id_tipo_evaluacion, id_oficio, codigo, codigo_tema, tema, titulo, contenido_multimedia, infografia_sugerida)
VALUES
-- E-G1 · tema E-T1
(1, 1, 'E-G1', 'E-T1', $g$Desenergizar y verificar antes de trabajar$g$,
 $g$Antes de tocar: corta la corriente, avisa y comprueba que no hay tensión$g$,
 $g$• Cuatro pasos antes de abrir cualquier caja, apagador o tablero:
   1. Corta el interruptor del circuito.
   2. Avisa a quienes estén en el lugar, y deja una nota o cubre el interruptor para que nadie lo suba.
   3. Comprueba con detector de tensión o multímetro que los cables no tienen corriente.
   4. Recién entonces trabaja.
• Prueba tu detector en un contacto que sí tenga corriente antes de usarlo, para saber que funciona.
• Que la luz no prenda no prueba que el cable esté sin corriente. En edificios y vecindades los circuitos suelen estar mal identificados.
• Al cambiar un tablero, bajar el general no apaga los cables que llegan del medidor. Esa parte sigue con corriente y le corresponde a CFE.$g$,
 $g$Cuatro viñetas numeradas con un tablero, un aviso, un detector y una persona trabajando, con el cable de entrada del medidor resaltado en rojo.$g$),
-- E-G2 · tema E-T2
(1, 1, 'E-G2', 'E-T2', $g$Protecciones y tablero$g$,
 $g$El interruptor protege al cable: por qué se dispara y cómo no empeorarlo$g$,
 $g$• Un interruptor que se baja casi siempre avisa de una sobrecarga (muchos aparatos) o de un corto.
• Nunca pongas un interruptor más grande para que “ya no se baje”. El que se calienta es el cable.
• Regla general de calibres: cable 14 AWG, interruptor hasta 15 A; 12 AWG, hasta 20 A; 10 AWG, hasta 30 A.
• Nunca puentees un fusible con una moneda o alambre.
• Si el interruptor se baja apenas lo subes, es probable que haya un corto. No insistas: revisa el circuito.
• Si el tablero es muy viejo, recomienda reemplazarlo.$g$,
 $g$Tabla con tres cables de distinto grosor y su interruptor correspondiente, con una cruz roja sobre “interruptor grande, cable delgado”.$g$),
-- E-G3 · tema E-T3
(1, 1, 'E-G3', 'E-T3', $g$Puesta a tierra y zonas húmedas$g$,
 $g$Tierra física y baños: cómo instalar un contacto que no te electrocute$g$,
 $g$• La tierra física da a la corriente un camino seguro si un aparato falla, en lugar de pasar por tu cuerpo.
• La tierra y el neutro solo se unen en el tablero principal. No los puentees en un contacto.
• En baños, cocinas, áreas de lavado y exteriores, usa contactos con protección por falla a tierra (ICFT) y apriétales el botón de prueba cada cierto tiempo.
• Si la instalación no tiene tierra, lo correcto es tender un conductor desde el tablero. El ICFT solo es una protección parcial.
• Una regadera eléctrica necesita circuito exclusivo, tierra y protección por falla a tierra. Nunca la conectes con extensión.$g$,
 $g$Baño con un contacto ICFT junto al lavabo y una línea verde de tierra hacia el tablero; una cruz roja sobre “tierra conectada al neutro”.$g$),
-- E-G4 · tema E-T4
(1, 1, 'E-G4', 'E-T4', $g$Conductores y conexiones$g$,
 $g$Empalmes y cables viejos: conexiones que no se calientan ni se queman$g$,
 $g$• Los empalmes se hacen con conectores adecuados y dentro de una caja con tapa que se pueda revisar. No se tapan con yeso ni solo con cinta.
• Antes de agregar un contacto a una instalación vieja, revisa el cable. Si el forro está reseco, quebradizo o con cobre visible, hay que reemplazar el circuito, no solo el tramo dañado.
• Escoge el calibre del cable según lo que va a alimentar.
• Señales de alerta: olor a quemado, cinta derretida, contactos calientes u oscuros, y focos que parpadean.$g$,
 $g$Tres cajas en fila: empalme con cinta dentro del muro (cruz roja), conector sin caja (amarillo) y conector dentro de caja con tapa (palomita verde).$g$),
-- E-G5 · tema E-T5
(1, 1, 'E-G5', 'E-T5', $g$Cargas y ampliaciones$g$,
 $g$Cálculo rápido de cargas: ¿aguanta tu tablero el aparato nuevo?$g$,
 $g$• Lee la placa del aparato: ahí está su consumo en watts o amperes.
• Fórmula: amperes = watts ÷ volts. En vivienda se usa normalmente 127 V.
• Ejemplo: un horno de 2,000 W consume cerca de 15.7 A.
• Suma las cargas de todos los aparatos del circuito y compara con lo que aguantan el cable y el interruptor.
• Aparatos como minisplit, calentador o regadera eléctrica trabajan horas seguidas: dales circuito exclusivo y no los cargues al límite.
• Si la suma rebasa el interruptor general o el cable de entrada, no instales: recomienda ampliar la capacidad del servicio con CFE.$g$,
 $g$Barra que se llena al sumar refrigerador, lavadora, horno y calentador, con un tablero de 30 A que se desborda.$g$),
-- E-G6 · tema E-S1
(2, 1, 'E-G6', 'E-S1', $g$EPP eléctrico$g$,
 $g$Tu equipo eléctrico: qué usar, cómo revisarlo y cuándo cambiarlo$g$,
 $g$• Equipo mínimo: guantes dieléctricos, calzado dieléctrico, lentes de seguridad y herramienta con mango aislado.
• Los guantes de carnaza o de tela no protegen contra choque eléctrico.
• Antes de cada uso, revisa que guantes, calzado y herramienta no tengan cortes, grietas, resequedad ni mangos rotos.
• Si algo está dañado, ya no aísla: reemplázalo.
• Guarda los guantes limpios y sin doblar ni aplastar.$g$,
 $g$Silueta de trabajador con las cuatro piezas señaladas y una lista de “revisa antes de usar”.$g$),
-- E-G7 · tema E-S2
(2, 1, 'E-G7', 'E-S2', $g$Choque y arco eléctrico$g$,
 $g$Choque y arco eléctrico: cómo pararte y qué evitar$g$,
 $g$• El choque ocurre cuando la corriente pasa por tu cuerpo. El arco eléctrico es un destello con calor muy fuerte al fallar un tablero o un cable.
• Para subir o bajar un interruptor con corriente: párate de lado, voltea la cara y usa lentes o careta y guantes dieléctricos.
• No trabajes con manos mojadas, piso mojado ni en zonas húmedas. Corta la corriente y seca antes.
• Quítate anillos, cadenas y relojes metálicos, y evita ropa de fibras sintéticas que se derriten con el calor.
• Si alguien recibe un choque, corta la corriente antes de tocarlo y llama al 911.$g$,
 $g$Trabajador de lado frente al tablero con la cara volteada, y un recuadro con el 911 y “corta la corriente primero”.$g$),
-- E-G8 · tema E-S3
(2, 1, 'E-G8', 'E-S3', $g$Escaleras y trabajo en altura$g$,
 $g$Escaleras y altura: trabajar seguro sin caerte$g$,
 $g$• Cerca de instalaciones eléctricas usa escalera de fibra de vidrio o material aislante, no de metal.
• Apóyala sobre piso firme y pide que alguien la sujete. Como regla práctica, la base se separa 1 m de la pared por cada 4 m de altura.
• Mantén tres puntos de contacto al subir y no cargues herramienta en las manos; usa cinturón o bolsa.
• En azoteas, no trabajes cerca del borde sin protección. Para trabajos en altura usa arnés con un punto de anclaje firme.
• No trabajes en altura con lluvia o viento fuerte.$g$,
 $g$Escalera inclinada con la regla 1:4 dibujada, trabajador con arnés anclado y un borde de azotea marcado en rojo.$g$),
-- E-G9 · tema E-S4
(2, 1, 'E-G9', 'E-S4', $g$Postura y carga física$g$,
 $g$Cuida tu espalda, hombros y cuello$g$,
 $g$• Para cargar: dobla las rodillas, mantén la espalda recta y carga pegado al cuerpo. Divide el material y pide ayuda si pesa mucho.
• Al trabajar con los brazos arriba, haz pausas cortas, cambia de postura y usa un banco o escalera para quedar a la altura del trabajo.
• No esperes a que el dolor sea fuerte para parar.
• La NOM-036-1-STPS-2018 aplica al manejo manual de cargas desde 3 kg.$g$,
 $g$Dos siluetas, una cargando mal con la espalda doblada (cruz roja) y otra con las rodillas dobladas y la carga pegada al cuerpo (palomita verde).$g$),
-- E-G10 · tema E-S5
(2, 1, 'E-G10', 'E-S5', $g$Polvo, herramientas y calor$g$,
 $g$Polvo, ruido y calor en obra: protege tus ojos, pulmones, oídos y cuerpo$g$,
 $g$• Al taladrar o picar muros y losas, usa lentes de seguridad y mascarilla contra polvo.
• Con herramienta ruidosa, como el rotomartillo, usa protección auditiva.
• En días de calor, toma agua antes de tener sed, descansa a la sombra y usa gorra.
• Señales de golpe de calor: mareo, piel muy caliente, confusión o desmayo. Llama al 911 y lleva a la persona a la sombra.$g$,
 $g$Cuatro íconos (lentes, mascarilla, tapones u orejeras, botella de agua) con una alerta roja de golpe de calor.$g$),
-- P-G1 · tema P-T1
(1, 2, 'P-G1', 'P-T1', $g$Cerrar el agua y detectar fugas$g$,
 $g$Cerrar bien el agua y encontrar fugas sin romper de más$g$,
 $g$• Antes de abrir cualquier llave o tubo: cierra la llave de paso general, y si la casa tiene tinaco, cierra también su salida. Si no, el tinaco sigue alimentando la tubería por gravedad.
• Abre una llave en la parte baja para vaciar la tubería antes de desarmar.
• Cambia las llaves de ángulo que no cierran bien.
• Para encontrar una fuga oculta: cierra todas las llaves y mira el medidor. Si gira, hay fuga.
• Cierra válvulas por tramos y observa en cuál se detiene el medidor; así ubicas el tramo sin romper de más.
• Revisa el WC con unas gotas de colorante en el tanque: si el color pasa a la taza sin jalar, hay fuga interna.
• Si la fuga está en la calle o en la banqueta, se reporta a SACMEX (en 2024 pedía hacerlo por LOCATEL, 55 5658-1111).$g$,
 $g$Casa con tinaco y las dos llaves marcadas en rojo, y un medidor con la manecilla girando.$g$),
-- P-G2 · tema P-T2
(1, 2, 'P-G2', 'P-T2', $g$Tinaco, cisterna y flotador$g$,
 $g$Tinaco y cisterna: flotador, rebosadero y limpieza segura$g$,
 $g$• Tinaco que se derrama: casi siempre falla el flotador. Ajústalo o cámbialo; no pongas un tubo más largo para que desagüe.
• El rebosadero es solo una seguridad; no debe estar tirando agua de forma constante.
• Limpieza de cisterna: cierra la entrada de agua, vacía, ventila bien y no entres solo. Una persona se queda afuera con una cuerda o arnés para sacarte si te mareas.
• Una cisterna cerrada puede tener poco oxígeno o gases.
• No mezcles cloro con otros productos, como ácido muriático.
• Si el tinaco o la cisterna están rotos, sucios o sin tapa, avísalo al cliente.$g$,
 $g$Corte de tinaco con flotador y rebosadero señalados, y una cisterna con un ayudante afuera sosteniendo una cuerda.$g$),
-- P-G3 · tema P-T3
(1, 2, 'P-G3', 'P-T3', $g$Tuberías y uniones$g$,
 $g$Uniones y pruebas: que la tubería no gotee después$g$,
 $g$• CPVC (agua caliente) se pega con pegamento para CPVC. El de PVC no está hecho para ese material.
• Pasos para pegar: cierra y vacía el agua, corta el tubo a escuadra, quita las rebabas, seca las puntas, aplica el pegamento y respeta el tiempo de secado antes de abrir el agua.
• Sigue siempre las instrucciones del fabricante del tubo y del pegamento.
• Antes de tapar un muro: presuriza la tubería con un manómetro, mantenla bajo presión el tiempo que marque el fabricante y comprueba que la presión no baje.
• Revisa cada unión con la tubería bajo presión.
• Resana el muro solo después de que pase la prueba.$g$,
 $g$Cuatro viñetas del pegado (corte, rebaba, secado, pegamento) y un manómetro con la aguja estable.$g$),
-- P-G4 · tema P-T4
(1, 2, 'P-G4', 'P-T4', $g$Drenaje y ventilación$g$,
 $g$Drenaje: olores, sifones y agua que regresa$g$,
 $g$• El sifón (la “U” de la coladera o del lavabo) guarda agua que bloquea los gases del drenaje. Si se seca, huele a drenaje: llénalo con agua.
• Una coladera sin sifón necesita una trampa.
• La tubería de ventilación no debe estar tapada.
• No tapes una coladera con cemento: el agua del piso se queda sin salida.
• Cuando el agua del drenaje regresa en lluvias, revisa si el atasco es de la casa o de la red.
• Si es de la casa, destapa con sonda y considera una válvula antirretorno. Si es de la red, repórtalo a SACMEX.$g$,
 $g$Corte de un sifón con agua y otro seco, y una casa con una válvula antirretorno en la descarga.$g$),
-- P-G5 · tema P-T5
(1, 2, 'P-G5', 'P-T5', $g$Calentadores y gas$g$,
 $g$Calentadores y gas: instalación segura y qué hacer con una fuga$g$,
 $g$• El monóxido de carbono (CO) no se ve ni huele y puede intoxicar o matar.
• No instales un calentador de gas dentro de un baño cerrado ni de una recámara sin ventilación. Debe ir en un lugar con ventilación permanente y con salida de gases al exterior.
• Si hay olor a gas: cierra la llave de paso, apaga cualquier flama, no accionas interruptores eléctricos, abre puertas y ventanas y sal.
• Nunca busques una fuga con fuego. Usa agua con jabón en las uniones: donde haya burbujas, hay fuga.
• Si no la encuentras, llama al 911 y a la empresa de gas.
• El gas L.P. es más pesado que el aire y se acumula en la parte baja del lugar.$g$,
 $g$Baño cerrado con una cruz roja y un calentador en un patio con una palomita; una botella de agua jabonosa con burbujas en una unión.$g$),
-- P-G6 · tema P-S1
(2, 2, 'P-G6', 'P-S1', $g$EPP de plomería$g$,
 $g$Tu equipo de plomería: qué usar y cuándo$g$,
 $g$• Equipo básico: guantes (de hule o nitrilo para agua y químicos, de carnaza para trabajo con herramienta), calzado antiderrapante, lentes de seguridad y mascarilla.
• Usa lentes siempre que cortes tubería o rompas muros y pisos; las esquirlas pueden dañar un ojo en un instante.
• El calzado antiderrapante evita resbalones en pisos mojados.
• Revisa tu equipo antes de cada trabajo y cámbialo si está roto.$g$,
 $g$Silueta del trabajador con cuatro piezas señaladas y un recuadro “usa lentes al cortar o romper”.$g$),
-- P-G7 · tema P-S2
(2, 2, 'P-G7', 'P-S2', $g$Químicos, pegamentos y vapores$g$,
 $g$Pegamentos, cloro y vapores: cómo no intoxicarte$g$,
 $g$• Los pegamentos y limpiadores sueltan vapores que marean y se inflaman. Ventila, tapa el bote entre usos, usa guantes y mantenlo lejos de flamas.
• No mezcles cloro con otros productos, como ácido muriático, sosa o limpiadores: pueden liberar gases tóxicos.
• Usa un producto a la vez y enjuaga bien entre uno y otro.
• Si sientes mareo, tos o ardor en ojos o garganta, sal a un lugar con aire fresco.$g$,
 $g$Bote tapado junto a una ventana abierta, y un símbolo de “no mezclar” sobre dos botellas de químicos.$g$),
-- P-G8 · tema P-S3
(2, 2, 'P-G8', 'P-S3', $g$Cisternas, registros y azoteas$g$,
 $g$Cisternas, registros y azoteas: entrar y subir con seguridad$g$,
 $g$• Espacios cerrados (cisternas, registros, pozos): ventila, no entres solo y deja a alguien afuera con una cuerda o arnés.
• Sal de inmediato si te mareas o sientes falta de aire.
• En azoteas: no trabajes cerca del borde sin protección. Usa arnés con un punto de anclaje firme y una escalera sobre piso firme.
• No trabajes en altura con lluvia o viento fuerte.$g$,
 $g$Dos escenas: un registro con un ayudante afuera, y una azotea con un trabajador con arnés anclado lejos del borde.$g$),
-- P-G9 · tema P-S4
(2, 2, 'P-G9', 'P-S4', $g$Postura y carga física$g$,
 $g$Cuida tus rodillas, espalda y hombros$g$,
 $g$• Trabajando de rodillas o agachado: usa rodilleras o un cojín, cambia de postura y haz pausas cortas.
• Para cargar tinacos, bombas y rollos: dobla las rodillas, mantén la espalda recta y carga pegado al cuerpo. Divide la carga o pide ayuda si pesa mucho.
• No esperes a que el dolor sea fuerte para parar.
• La NOM-036-1-STPS-2018 aplica al manejo manual de cargas desde 3 kg.$g$,
 $g$Dos siluetas: una con la espalda doblada (cruz roja) y otra con las rodillas dobladas y la carga pegada al cuerpo (palomita verde).$g$),
-- P-G10 · tema P-S5
(2, 2, 'P-G10', 'P-S5', $g$Soplete, aguas negras e higiene$g$,
 $g$Soplete, aguas negras e higiene$g$,
 $g$• Antes de usar el soplete: retira o protege madera, tela y plástico, usa guantes y lentes, y ten agua o un extintor a la mano.
• Apaga el soplete y revisa que no queden brasas antes de irte.
• Con aguas negras o drenajes: usa guantes impermeables, cubre tus heridas y lávate manos y antebrazos con agua y jabón antes de comer o tocarte la cara.
• Si te cortas con algo del drenaje, lava la herida de inmediato y busca atención médica.$g$,
 $g$Soplete con un extintor al lado y materiales inflamables apartados, y un lavado de manos con jabón.$g$),
-- C-G1 · tema C-T1
(1, 3, 'C-G1', 'C-T1', $g$Corte y maquinaria segura$g$,
 $g$Sierra y maquinaria: guardas, empujadores y desconectar antes de ajustar$g$,
 $g$• Nunca quites la guarda de la sierra, aunque estorbe. Protege tus manos del disco.
• La cuchilla divisora evita que la tabla se cierre sobre el disco y salga disparada hacia ti.
• En cortes angostos, usa un empujador o un tope. Tu mano no debe quedar cerca del disco.
• Antes de cambiar el disco o ajustar la máquina: apágala, desconéctala de la corriente y espera a que todo se detenga por completo.
• Revisa que el disco esté afilado y la pieza bien sujeta antes de cortar.$g$,
 $g$Sierra de mesa con la guarda, la cuchilla divisora y un empujador señalados, y un cable desconectado con un recuadro “desconecta antes de tocar”.$g$),
-- C-G2 · tema C-T2
(1, 3, 'C-G2', 'C-T2', $g$Medición, trazo y ensamble$g$,
 $g$Medir bien, trazar y ensamblar para que el mueble dure$g$,
 $g$• Mide en varios puntos (arriba, en medio y abajo), porque los muros rara vez están a plomo, sobre todo en construcciones viejas o con hundimientos.
• Revisa con nivel y plomada, usa la medida menor y deja holgura para ajustar.
• “Mide dos veces, corta una.”
• No atornilles directo al canto de aglomerado o MDF: se desgarra.
• Usa tarugos con adhesivo para madera o tornillos de ensamble, y haz un barreno guía antes de atornillar.
• El pegamento solo no soporta carga.$g$,
 $g$Pared con tres alturas de medición marcadas y una tabla con un tarugo y un tornillo bien colocados.$g$),
-- C-G3 · tema C-T3
(1, 3, 'C-G3', 'C-T3', $g$Materiales y fijación$g$,
 $g$Materiales y fijación: humedad, tablaroca y muros$g$,
 $g$• Humedad: el aglomerado y el MDF sin sellar se hinchan y se deshacen. Para gabinetes cerca de agua usa material resistente a la humedad o melamina con todos los cantos sellados.
• Separa la base del piso con zoclo para que el agua no suba.
• Tablaroca: no soporta carga por sí sola. Fija en los postes metálicos (bastidores) o refuerza con una tabla anclada a dos o más postes.
• Muros de concreto o tabique: usa taquetes y tornillos adecuados a ese material.
• Calcula el peso del mueble y de lo que va a cargar antes de elegir la fijación.$g$,
 $g$Corte de un muro de tablaroca con los postes marcados y un tornillo bien fijado; un gabinete bajo la tarja con zoclo.$g$),
-- C-G4 · tema C-T4
(1, 3, 'C-G4', 'C-T4', $g$Acabados y productos químicos$g$,
 $g$Acabados y químicos: barniz, thinner y trapos con riesgo de incendio$g$,
 $g$• Antes de barnizar: lija, quita el polvo con trapo seco o aspirado y comprueba que la madera esté seca. La humedad y el polvo arruinan el acabado.
• Aplica capas delgadas y respeta el tiempo de secado entre ellas, según el fabricante.
• Trapos con aceite o barniz pueden calentarse solos y provocar un incendio si se amontonan.
• Extiéndelos a secar al aire libre, lejos del calor, o sumérgelos en agua dentro de un recipiente metálico con tapa.
• Guarda los solventes tapados, lejos de calor y chispas.$g$,
 $g$Trapos arrugados en bolsa con una cruz roja, trapos extendidos al aire y un bote metálico con agua y tapa.$g$),
-- C-G5 · tema C-T5
(1, 3, 'C-G5', 'C-T5', $g$Instalación en sitio$g$,
 $g$Instalar en sitio: puertas, clósets y trabajo en casas ocupadas$g$,
 $g$• Puertas que rozan: revisa primero que el marco esté a plomo y a escuadra y que las bisagras estén firmes. Solo rebaja lo necesario.
• No cortes a ojo: un corte de más no se puede deshacer.
• Trabajo en casas ocupadas: haz los cortes en un área aparte (patio, azotea o taller), con aspiración.
• Cubre los muebles, usa mascarilla y limpia con aspiradora, sin barrer en seco.
• Si hay niños o personas mayores, avisa cuándo habrá ruido y polvo.$g$,
 $g$Puerta con nivel sobre el marco y bisagras señaladas, y un patio con una mesa de corte y una aspiradora.$g$),
-- C-G6 · tema C-S1
(2, 3, 'C-G6', 'C-S1', $g$EPP de carpintería$g$,
 $g$Tu equipo de carpintería: qué usar siempre$g$,
 $g$• Equipo básico: lentes de seguridad, protección auditiva, mascarilla contra polvo y calzado de seguridad.
• Usa lentes siempre que cortes, lijes o cepilles: las astillas y el polvo dañan los ojos en un instante.
• Revisa tu equipo antes de cada trabajo y cámbialo si está roto o sucio.
• Un equipo bueno que no usas no te protege.$g$,
 $g$Silueta del trabajador con cuatro piezas señaladas y un recuadro “lentes siempre que haya corte o lijado”.$g$),
-- C-G7 · tema C-S2
(2, 3, 'C-G7', 'C-S2', $g$Ruido y polvo de madera$g$,
 $g$Ruido y polvo de madera: cuida tus oídos y tus pulmones$g$,
 $g$• El ruido de sierras y cepillos daña el oído poco a poco y sin dolor. Acostumbrarse no lo hace menos dañino.
• Usa tapones u orejeras adecuados. El algodón no protege bien.
• El polvo de madera irrita ojos, nariz y pulmones.
• Limpia con aspiradora o trapo húmedo; no soples ni barras en seco, porque levantas el polvo.
• Usa mascarilla contra polvo al lijar, cortar o limpiar.$g$,
 $g$Orejeras junto a una sierra, y una aspiradora con una cruz roja sobre un soplete de aire.$g$),
-- C-G8 · tema C-S3
(2, 3, 'C-G8', 'C-S3', $g$Máquinas y herramientas$g$,
 $g$Máquinas y herramientas: ropa, sujeción y filo$g$,
 $g$• Ropa ajustada, mangas arriba, pelo recogido, sin cadenas ni pulseras. Lo suelto se enreda en piezas que giran.
• No uses guantes de tela cerca de partes giratorias.
• Un disco o cuchilla sin filo se atora y la máquina rebota. Afila o cambia el disco.
• Sujeta la pieza con prensas o topes antes de cortar.
• Si algo falla, apaga y desconecta antes de intentar sacar la pieza.$g$,
 $g$Silueta con ropa suelta (cruz roja) y con ropa ajustada (palomita), y una pieza sujeta con prensa.$g$),
-- C-G9 · tema C-S4
(2, 3, 'C-G9', 'C-S4', $g$Postura y carga física$g$,
 $g$Cuida tu espalda y tu cuello en el taller$g$,
 $g$• Al lijar o cepillar: ajusta la mesa a la altura de tu cadera, cambia de postura y haz pausas cortas.
• No trabajes encorvado por horas.
• Hojas de triplay o MDF: pesan mucho. Cárgalas entre dos o con un carrito, doblando las rodillas y con la espalda recta.
• No esperes a que el dolor sea fuerte para parar.
• La NOM-036-1-STPS-2018 aplica al manejo manual de cargas desde 3 kg.$g$,
 $g$Mesa a la altura de la cadera con un trabajador derecho, y dos personas cargando una hoja entre dos.$g$),
-- C-G10 · tema C-S5
(2, 3, 'C-G10', 'C-S5', $g$Solventes, incendio y fatiga$g$,
 $g$Solventes, incendios y cansancio$g$,
 $g$• Con thinner, barniz o pegamentos: ventila, usa mascarilla para vapores y guantes, y aléjalos de calentadores, focos calientes y chispas.
• Los vapores marean y se inflaman.
• Ten un extintor o agua cerca del área de trabajo.
• Cansancio: con máquinas, un descuido puede costar un dedo. Haz pausas y no uses sierras cuando estés agotado.
• Deja los cortes difíciles para cuando estés descansado.$g$,
 $g$Taller con ventana abierta, un extintor junto a la puerta y un reloj que marca una pausa cada cierto tiempo.$g$),
-- A-G1 · tema A-T1
(1, 4, 'A-G1', 'A-T1', $g$Trazo, nivel y plomo$g$,
 $g$Trazo, nivel y plomo: que el muro salga derecho desde la primera hilada$g$,
 $g$• Un error en la primera hilada se arrastra hasta arriba. Revísala con cuidado antes de seguir.
• Para el trazo usa hilo guía tensado entre estacas, y comprueba la escuadra con el triángulo 3-4-5: mide 3 m en un lado, 4 m en el otro y la diagonal debe dar 5 m.
• Para el nivel usa un nivel largo o una manguera de nivel, no solo un nivel corto en un punto.
• Para el plomo revisa con plomada o nivel cada pocas hiladas, y corrige de inmediato mientras la mezcla está fresca.
• No escondas un defecto con aplanado grueso: agrega peso y se puede desprender.$g$,
 $g$Cuarto con hilos y estacas, el triángulo 3-4-5 marcado y un muro con una plomada.$g$),
-- A-G2 · tema A-T2
(1, 4, 'A-G2', 'A-T2', $g$Muros, castillos y dalas$g$,
 $g$Muros, castillos y dalas: lo que sostiene la casa en un sismo$g$,
 $g$• Traslapa las piezas para que las juntas verticales no coincidan entre hiladas. Si coinciden, se forma una línea débil donde se agrieta.
• Rellena bien de mortero las juntas horizontales y verticales.
• Los castillos y las dalas van en esquinas, extremos, intersecciones y en la parte alta del muro. Llevan varilla y estribos.
• En la CDMX, con sismos, un muro sin castillos ni dalas puede desplomarse.
• Las separaciones, el armado y el anclaje los define el proyecto y las normas; no los cambies para ahorrar.$g$,
 $g$Muro con tabiques traslapados, castillos y dala de cerramiento señalados, y otro muro sin ellos agrietado.$g$),
-- A-G3 · tema A-T3
(1, 4, 'A-G3', 'A-T3', $g$Mezclas, concreto y curado$g$,
 $g$Mezclas, concreto y curado$g$,
 $g$• Mezcla: cemento y arena limpia en la proporción indicada. La arena con tierra o arcilla impide que el cemento se pegue.
• Agrega el agua poco a poco hasta tener consistencia plástica. Demasiada agua debilita y agrieta la mezcla.
• Usa la mezcla antes de que empiece a endurecer; no la rehidrates.
• Curado: después de colar, mantén el concreto húmedo con riego frecuente o costales mojados, protegido del sol directo y de la lluvia.
• Si se seca muy rápido, se agrieta y queda más débil. La duración del curado la marca el proyecto.$g$,
 $g$Tres botes de mezcla (muy líquida, plástica, seca), y una losa con costales mojados y una manguera.$g$),
-- A-G4 · tema A-T4
(1, 4, 'A-G4', 'A-T4', $g$Ranuras e impermeabilización$g$,
 $g$Ranuras para instalaciones e impermeabilización de azoteas$g$,
 $g$• Ranuras en muros: usa ranuras verticales y poco profundas, entre castillos.
• No cortes un castillo ni una varilla, ni abras ranuras horizontales largas: debilitan el muro.
• Si necesitas pasar por un elemento estructural, consulta al responsable de la obra.
• Impermeabilizar: limpia, repara y sella las grietas, da pendiente hacia la bajada pluvial, destapa la bajada y aplica primario.
• Trabaja en un día sin lluvia y respeta los tiempos de secado que marque el fabricante.
• Nunca apliques sobre polvo, humedad o charcos.$g$,
 $g$Muro con una ranura vertical bien hecha y otra horizontal con cruz roja, y una azotea con pendiente y bajada pluvial señaladas.$g$),
-- A-G5 · tema A-T5
(1, 4, 'A-G5', 'A-T5', $g$Estructura existente y sismo$g$,
 $g$Muros de carga, grietas y sismo$g$,
 $g$• Muro de carga: sostiene la losa y los pisos de arriba. No lo derribes sin confirmación de un ingeniero estructural o del responsable de obra.
• A simple vista no siempre se distingue de un muro divisorio.
• Si es divisorio, apuntala antes y retíralo por partes.
• Grietas después de un sismo: una grieta en X, diagonal, escalonada o que cruza un castillo puede indicar daño estructural.
• No la tapes: pega un testigo de yeso para ver si sigue creciendo y recomienda que un especialista la revise.
• Avisa al cliente por escrito de lo que viste.$g$,
 $g$Planta con muro de carga y divisorio sombreados distinto, y un muro con grieta en X y un testigo de yeso.$g$),
-- A-G6 · tema A-S1
(2, 4, 'A-G6', 'A-S1', $g$EPP de obra$g$,
 $g$Tu equipo de obra: casco, botas, lentes y guantes$g$,
 $g$• Equipo básico: casco, botas de seguridad con casquillo y suela antiderrapante, lentes de seguridad y guantes de trabajo.
• Usa casco siempre que haya trabajo arriba de ti o materiales que puedan caer.
• Las botas con casquillo protegen los pies de golpes y de clavos en el piso.
• Revisa tu equipo antes de cada jornada y cámbialo si está roto o vencido.
• Un casco golpeado fuerte debe cambiarse aunque se vea bien.$g$,
 $g$Silueta del trabajador con cuatro piezas señaladas y un recuadro “casco siempre con trabajo arriba”.$g$),
-- A-G7 · tema A-S2
(2, 4, 'A-G7', 'A-S2', $g$Cemento, polvo y piel$g$,
 $g$Cemento, polvo y piel: protege tu piel y tus pulmones$g$,
 $g$• El cemento húmedo irrita y puede quemar la piel si se queda mucho tiempo en contacto.
• Usa guantes impermeables y botas, cambia la ropa empapada de mezcla y lávate con agua limpia en cuanto te caiga.
• El polvo de concreto y tabique daña ojos y pulmones con el tiempo.
• Al cortar, picar o lijar, usa mascarilla contra polvo y lentes.
• Humedece un poco la superficie antes de cortar para levantar menos polvo, y no barras en seco.$g$,
 $g$Manos con guantes impermeables junto a una revolvedora, y una mascarilla y lentes junto a una cortadora de disco.$g$),
-- A-G8 · tema A-S3
(2, 4, 'A-G8', 'A-S3', $g$Andamios, escaleras y altura$g$,
 $g$Andamios, escaleras y altura sin caerte$g$,
 $g$• Andamio seguro: nivelado, con plataforma completa, barandales y acceso seguro. Nunca tablones sueltos.
• Revísalo cada día antes de subir.
• Escalera: sobre piso firme, con alguien que la sujete y con tres puntos de contacto al subir.
• En azoteas o a más de 1.80 m de altura: arnés con un punto de anclaje firme. No trabajes cerca del borde sin protección.
• No trabajes en altura con lluvia o viento fuerte.$g$,
 $g$Andamio con barandales y plataforma completa, y un trabajador con arnés anclado lejos del borde.$g$),
-- A-G9 · tema A-S4
(2, 4, 'A-G9', 'A-S4', $g$Postura y carga física$g$,
 $g$Cuida tu espalda y tus rodillas en la obra$g$,
 $g$• Un bulto de cemento pesa unos 50 kg: cárgalo entre dos o usa una carretilla.
• Para cargar: dobla las rodillas, mantén la espalda recta y carga pegado al cuerpo.
• Trabajando abajo (pegando tabique, colocando piso, resanando): usa rodilleras o un banquito, cambia de postura y haz pausas cortas.
• No esperes a que el dolor sea fuerte para parar.
• La NOM-036-1-STPS-2018 aplica al manejo manual de cargas desde 3 kg.$g$,
 $g$Dos trabajadores cargando un bulto entre dos, y un carretillero con la espalda recta.$g$),
-- A-G10 · tema A-S5
(2, 4, 'A-G10', 'A-S5', $g$Herramienta eléctrica y calor$g$,
 $g$Herramienta eléctrica y calor en obra$g$,
 $g$• Antes de usar rotomartillo, esmeriladora, revolvedora o sierra: revisa el cable y la guarda.
• No uses cables pelados ni extensiones tiradas en charcos: puedes recibir un choque.
• Desconecta la máquina antes de ajustarla o cambiar el disco.
• Usa protección auditiva con herramienta ruidosa.
• Calor: toma agua antes de tener sed, descansa a la sombra y usa gorra. El golpe de calor causa mareo, piel muy caliente, confusión o desmayo.
• Si ocurre, lleva a la persona a la sombra y llama al 911.$g$,
 $g$Esmeriladora con la guarda señalada y un cable en un charco con cruz roja, y una botella de agua con una sombra.$g$)
ON CONFLICT (id_oficio, codigo) DO UPDATE SET
  id_tipo_evaluacion   = EXCLUDED.id_tipo_evaluacion,
  codigo_tema          = EXCLUDED.codigo_tema,
  tema                 = EXCLUDED.tema,
  titulo               = EXCLUDED.titulo,
  contenido_multimedia = EXCLUDED.contenido_multimedia,
  infografia_sugerida  = EXCLUDED.infografia_sugerida;

COMMIT;

-- Verificación: debe dar 4 oficios x 2 tipos = 8 filas de 5 guías cada una
SELECT id_oficio, id_tipo_evaluacion, COUNT(*) AS guias
FROM ctutorial GROUP BY 1, 2 ORDER BY 1, 2;
