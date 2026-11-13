// test-salud.js
// Pantalla del test de salud ocupacional (tipo 2). Usa el componente Cuestionario.

import Head from 'next/head';
import LayoutTest from '../../componentes/LayoutTest';
import Cuestionario from '../../componentes/Cuestionario';

export default function TestSalud() {
  return (
    <>
      <Head>
        <title>AcreditaTech - Test de Salud Ocupacional</title>
      </Head>
      <LayoutTest>
        <Cuestionario tipo={2} />
      </LayoutTest>
    </>
  );
}