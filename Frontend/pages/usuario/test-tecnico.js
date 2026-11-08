// test-tecnico.js
// Pantalla del test técnico (tipo 1). Usa el componente Cuestionario.

import Head from 'next/head';
import LayoutTest from '../../componentes/LayoutTest';
import Cuestionario from '../../componentes/Cuestionario';

export default function TestTecnico() {
  return (
    <>
      <Head>
        <title>AcreditaTech - Test Técnico</title>
      </Head>
      <LayoutTest>
        <Cuestionario tipo={1} />
      </LayoutTest>
    </>
  );
}