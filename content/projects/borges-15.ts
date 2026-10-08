import type { Development, ResidenceMedia } from './index';
// Written by `cli promote` (website/scripts/prepare-apt-media.py): only approved media (R-PIPE-PROMOTE). Don't hand-edit.
import promoted from './borges-15.media.json';

// Borges 15, Lapa, Lisbon (LIVO): 3B and 1A from projects/Borges-15-Lisbon (the apartment pipeline, runbook §11).
// The building and its unit outlines come from building/frames.json (P6, building/scripts/package_frames.py). Media arrive phase by phase
// through `cli promote` (website/scripts/prepare-apt-media.py); an empty src shows "coming soon", never another home's media.
// Languages: English and European Portuguese (`pt`), not Hebrew (lib/i18n LANG_PAGES).
const base = '/projects/borges-15';

export const borges15: Development = {
 id: 'borges-15', name: 'Borges 15', location: 'Lapa · Lisbon',
 description: 'Eight homes at Borges 15, Lapa: two duplex T3 penthouses over the top two floors, four T1s and two ground-floor studios, between the Tagus and the Basilica da Estrela.',
 source: 'https://borges15.com/apartment/3B',
 // P6: the building orbit (projects/Borges-15-Lisbon/building): 8 homes outlined.
 brand: { logo: `${base}/building/lapa-logo.png`, logoWidth: 95, logoHeight: 38, theme: 'borges', headerTone: 'light', directoryNote: 'Building explorer · Eight homes · Lapa, Lisbon', directoryNotePt: 'Explorador do edifício · Oito casas · Lapa, Lisboa' },
 currency: '€',
 views: ['3b'],
 info: {
  address: 'Rua Borges Carneiro 15, Lisbon', area: 'Lapa · Estrela parish', kicker: 'Eight apartments in the soul of Lisbon', floors: 5, moveIn: 'August 2027',
  intro: 'A boutique building of eight homes by LIVO in Lapa, Lisbon’s embassy quarter, between the Tagus riverfront and the Basilica da Estrela. Its top two floors hold two duplex T3 residences, delivered with the complete Prime LUX specification and interior design and furniture included.',
  location: ['Lapa is the embassy quarter: tree-lined streets, eighteenth-century mansions and the Basilica da Estrela on the hill, five minutes away on foot. Jardim da Estrela, the Museu Nacional de Arte Antiga and São Bento are all a short walk.',
   'Two new metro stations open within 230 m and 700 m (Infante Santo and Estrela, 2027–2028). Baixa is an 8-minute drive and the airport 12.'],
  disclaimer: 'A demo, not an offer to sell. Interiors, films and furniture are AI-assisted illustrations based on the developer’s plans and Prime LUX renders; areas follow the developer’s plans. Confirm every detail with LIVO.',
  mapQuery: 'Rua Borges Carneiro 15, Lisboa',
 },
 contact: { name: 'Livo Sales', agency: 'LIVO · Borges 15', phone: '+351 918 131 132', phoneIntl: '+351918131132', email: 'sales@borges15.com', role: 'Project sales' },
 // Availability and prices as borges15.com lists them (its apartments table, read 2026-10-06): RC-B is sold, the rest
 // are available. Zones: 0a = RC-A (rear studio, patio), 0b = RC-B (front studio), a = left half from the street.
 listings: { '0a': { price: 549000 }, '1a': { price: 649900 }, '1b': { price: 649900 }, '2a': { price: 694000 }, '2b': { price: 694000 }, '3a': { price: 1395000 }, '3b': { price: 1395000 } },
 pt: {
  name: 'Borges 15', location: 'Lapa · Lisboa', description: 'Oito casas no Borges 15, na Lapa: duas penthouses duplex T3 nos dois últimos pisos, quatro T1 e dois estúdios no rés-do-chão, entre o Tejo e a Basílica da Estrela.',
  info: {
   address: 'Rua Borges Carneiro 15, Lisboa', area: 'Lapa · freguesia da Estrela', kicker: 'Oito apartamentos na alma de Lisboa', moveIn: 'Agosto de 2027',
   intro: 'Um edifício boutique de oito casas da LIVO na Lapa, o bairro das embaixadas de Lisboa, entre a frente ribeirinha do Tejo e a Basílica da Estrela. Os dois últimos pisos acolhem dois duplex T3, entregues com a especificação Prime LUX completa, com design de interiores e mobiliário incluídos.',
   location: ['A Lapa é o bairro das embaixadas: ruas arborizadas, palacetes do século XVIII e a Basílica da Estrela na colina, a cinco minutos a pé. O Jardim da Estrela, o Museu Nacional de Arte Antiga e São Bento ficam a uma curta caminhada.',
    'Duas novas estações de metro abrem a 230 m e a 700 m (Infante Santo e Estrela, 2027–2028). A Baixa fica a 8 minutos de carro e o aeroporto a 12.'],
   disclaimer: 'Uma demonstração, não uma proposta de venda. Interiores, filmes e mobiliário são ilustrações criadas com apoio de IA a partir das plantas do promotor e das imagens Prime LUX; as áreas seguem as plantas do promotor. Confirme todos os detalhes com a LIVO.',
  },
  contact: { name: 'Vendas LIVO', agency: 'LIVO · Borges 15', role: 'Vendas do projeto' },
 },
 // The developer's façade render (borges15.com); there is no rear render, so the view has no Front/Rear switch.
 references: [`${base}/building/architect-front.jpg`],
 // Empty sources = not produced yet: the tab shows "coming soon" (R-PIPE-PLACEHOLDER).
 media: { film: { src: '', poster: '' }, images: [], model: '' },
 // The penthouse twins share 3B's media and the T1s share 1A's; plans and facts stay per home (residences below).
 // The ground-floor studios are a different type and stay empty (coming soon).
 apartmentMedia: (m => ({ ...m, '3a': m['3b'], '1b': m['1a'], '2a': m['1a'], '2b': m['1a'] }))(promoted as Record<string, ResidenceMedia>),
 residences: [
  { id: '3b', title: 'Duplex T3 · 3B', shortTitle: 'Duplex 3B', tagline: 'The top of Borges 15: three bedrooms over two floors, the river and the Basilica.', rooms: 4, outdoor: '2 balconies',
   area: 126, outdoorArea: 6.7, exposure: 'Northwest & southeast', label: 'Duplex T3 · Prime LUX', plan: `${base}/plans/3b.webp`, sourceUnits: 'Duplex T3 · 3B',
   description: 'An open living room and kitchen with a guest bedroom and shower room on the entry floor; upstairs, two bedrooms, each with its own shower room and balcony.',
   about: ['The entry floor (floor 3) is one long open room: a kitchen with a stone peninsula, a dining corner and the living room under the window, with an oak stair rising beside it. Off the hall, a bedroom with built-in wardrobes and a shower room. Upstairs (floor 4), two bedrooms at either end, each with a small en-suite shower room and its own balcony under the roof: one toward the Tagus, one over the street toward the Basilica.',
    'Areas follow the developer’s plans (126 m² gross; rooms of 30.6, 11.9, 15.1 and 12.8 m², balconies of 3.4 and 3.2 m²). Delivered as Prime LUX: the interior design and furniture are included. Worth checking: ceiling heights under the roof on floor 4 and the exact view from each balcony.'],
   pt: { title: 'Duplex T3 · 3B', shortTitle: 'Duplex 3B', tagline: 'O topo do Borges 15: três quartos em dois pisos, o rio e a Basílica.', outdoor: '2 varandas', exposure: 'Noroeste e sudeste', label: 'Duplex T3 · Prime LUX',
    description: 'Sala e cozinha em open space, com um quarto de hóspedes e uma casa de banho no piso de entrada; em cima, dois quartos, cada um com casa de banho e varanda próprias.',
    about: ['O piso de entrada (piso 3) é uma sala longa e aberta: cozinha com península em pedra, zona de refeições e a sala de estar junto à janela, com uma escada em carvalho a subir ao lado. A partir do hall, um quarto com roupeiros embutidos e uma casa de banho. Em cima (piso 4), dois quartos nas extremidades, cada um com uma pequena casa de banho privativa e uma varanda própria sob o telhado: uma virada ao Tejo, outra sobre a rua, em direção à Basílica.',
     'As áreas seguem as plantas do promotor (126 m² brutos; divisões de 30,6, 11,9, 15,1 e 12,8 m², varandas de 3,4 e 3,2 m²). Entregue em Prime LUX: o design de interiores e o mobiliário estão incluídos. A confirmar: o pé-direito sob o telhado no piso 4 e a vista exata de cada varanda.'] } },
  // 3A shares 3B's film, images and 3D (apartmentMedia above); its plan and facts are its own (developer plans, borges15.com).
  { id: '3a', title: 'Duplex T3 · 3A', shortTitle: 'Duplex 3A', tagline: 'The twin duplex under the roof: three bedrooms over two floors, the river and the Basilica.', rooms: 4, outdoor: '2 balconies',
   area: 126, outdoorArea: 6.3, exposure: 'Northwest & southeast', label: 'Duplex T3 · Prime LUX', plan: `${base}/plans/3a.webp`, sourceUnits: 'Unit 3A — T3 Duplex — 126 m²',
   description: 'An open living room and kitchen with a bedroom and shower room on the entry floor; upstairs, two bedrooms, each with its own shower room and balcony.',
   about: ['The entry floor (floor 3) runs from the street to the garden side: the living room behind the street French door, with the stair rising beside it, then the kitchen and its peninsula. Off the hall, a bedroom with built-in wardrobes and a shower room. Upstairs (floor 4), two bedrooms at either end, each with a small en-suite shower room and its own balcony under the roof: one toward the Tagus, one over the street toward the Basilica.',
    'Areas follow the developer’s plans (127.6 m² gross; rooms of 30.9, 14.0, 14.1 and 12.2 m², balconies of 3.1 and 3.2 m²). Delivered as Prime LUX: the interior design and furniture are included. The film, images and 3D model show its twin, 3B, in the same finish; the layout of 3A differs in detail.'],
   pt: { title: 'Duplex T3 · 3A', shortTitle: 'Duplex 3A', tagline: 'O duplex gémeo sob o telhado: três quartos em dois pisos, o rio e a Basílica.', outdoor: '2 varandas', exposure: 'Noroeste e sudeste', label: 'Duplex T3 · Prime LUX',
    description: 'Sala e cozinha em open space, com um quarto e uma casa de banho no piso de entrada; em cima, dois quartos, cada um com casa de banho e varanda próprias.',
    about: ['O piso de entrada (piso 3) estende-se da rua até ao lado do jardim: a sala de estar atrás da porta envidraçada para a rua, com a escada a subir ao lado, e depois a cozinha com a sua península. A partir do hall, um quarto com roupeiros embutidos e uma casa de banho. Em cima (piso 4), dois quartos nas extremidades, cada um com uma pequena casa de banho privativa e uma varanda própria sob o telhado: uma virada ao Tejo, outra sobre a rua, em direção à Basílica.',
     'As áreas seguem as plantas do promotor (127,6 m² brutos; divisões de 30,9, 14,0, 14,1 e 12,2 m², varandas de 3,1 e 3,2 m²). Entregue em Prime LUX: o design de interiores e o mobiliário estão incluídos. O filme, as imagens e o modelo 3D mostram o seu gémeo, o 3B, com o mesmo acabamento; a planta do 3A difere em pormenores.'] } },
  // The four T1s share 1A's film, images and 3D (apartmentMedia above); each keeps its own plan and areas (developer plans).
  // 1A's plan is its photoreal top-down; A units are 1A's layout, B units the mirror with an angled bedroom wall.
  ...(['2a', '2b', '1a', '1b'] as const).map(id => {
   const floor = id[0], b = id[1] === 'b', side = b ? 'right' : 'left', U = id.toUpperCase();
   const [gross, sala, quarto, is] = b ? ['67.8', '27.7', '16.0', '4.9'] : ['68.6', '29.0', '14.2', '4.7'];
   const pt = (n: string) => n.replace('.', ',');
   const own = id === '1a', price = floor === '1' ? '649,900' : '694,000', pricePt = floor === '1' ? '649 900' : '694 000';
   return { id, title: `T1 · ${U}`, shortTitle: `T1 ${U}`, tagline: `A one-bedroom home on floor ${floor}, from the street front to the garden side.`, rooms: 2, outdoor: 'Juliet balconies',
    area: 68, outdoorArea: 0, exposure: 'Street & garden', label: 'T1 · Prime LUX', plan: `${base}/plans/${id}.webp`, sourceUnits: `Unit ${U} — T1 — 68 m²`,
    description: `The ${side} half of floor ${floor}: a living room and kitchen, a bedroom and a shower room, with Juliet balconies front and back.`,
    about: [`Floor ${floor}, the ${side} half of the building as seen from the street. One long home from front to back: the living room behind the street French doors, the kitchen with its peninsula beside the curved stair wall, a hall past the shower room, and the bedroom at the garden end${b ? ' under its angled rear wall' : ''}. A home for one or two, or a rental investment.`,
     `Areas follow the developer’s plan (${gross} m² gross; living room and kitchen ${sala} m², bedroom ${quarto} m², shower room ${is} m²); price €${price}. ${own ? 'The film, images and 3D model show this home' : `The film, images and 3D model show 1A, ${b ? 'the mirrored twin of this layout' : 'the same layout one floor down'},`} furnished in the Prime LUX style; the furniture is illustrative.`],
    pt: { title: `T1 · ${U}`, shortTitle: `T1 ${U}`, tagline: `Um T1 no piso ${floor}, da frente da rua até ao lado do jardim.`, outdoor: 'Varandas francesas', exposure: 'Rua e jardim', label: 'T1 · Prime LUX',
     description: `A metade ${b ? 'direita' : 'esquerda'} do piso ${floor}: sala e cozinha, um quarto e uma casa de banho, com varandas francesas à frente e atrás.`,
     about: [`Piso ${floor}, a metade ${b ? 'direita' : 'esquerda'} do edifício vista da rua. Uma casa longa, da frente às traseiras: a sala atrás das portas envidraçadas para a rua, a cozinha com península junto à parede curva da escada, um hall que passa pela casa de banho e o quarto do lado do jardim${b ? ', sob a sua parede traseira inclinada' : ''}. Uma casa para uma ou duas pessoas, ou um investimento para arrendamento.`,
      `As áreas seguem a planta do promotor (${pt(gross)} m² brutos; sala e cozinha ${pt(sala)} m², quarto ${pt(quarto)} m², casa de banho ${pt(is)} m²); preço ${pricePt} €. ${own ? 'O filme, as imagens e o modelo 3D mostram esta casa' : `O filme, as imagens e o modelo 3D mostram o 1A, ${b ? 'o gémeo espelhado desta planta' : 'a mesma planta um piso abaixo'},`} mobilada no estilo Prime LUX; o mobiliário é ilustrativo.`] } };
  }),
  // The ground floor (RC-A, RC-B) is a different type: facts and plans only, no film, images or 3D (coming soon).
  { id: '0a', title: 'Studio · RC-A', shortTitle: 'Studio RC-A', tagline: 'The only studio with its own outdoor space: a 22 m² patio onto the garden.', rooms: 1, outdoor: 'Patio',
   area: 48, outdoorArea: 22, exposure: 'Garden side', label: 'T0 + patio', plan: `${base}/plans/rc-a.webp`, sourceUnits: 'Unit RC-A — T0 + Patio — 48 m²',
   description: 'A ground-floor studio at the back of the building, opening onto its own patio, with a sleeping loft under a 3.65 m ceiling.',
   about: ['The only studio in Borges 15 with private outdoor space: a 22 m² patio at the back, onto the garden. A 3.65-metre ceiling carries a sleeping loft of 2.5 by 3.2 metres; 48 m² plus an 8 m² loft, with light from two sides.',
    'Area and price as borges15.com lists them (48 m² + 22 m² patio, €549,000). The film, images and 3D model of this home are in preparation.'],
   pt: { title: 'Estúdio · RC-A', shortTitle: 'Estúdio RC-A', tagline: 'O único estúdio com espaço exterior próprio: um pátio de 22 m² virado ao jardim.', outdoor: 'Pátio', exposure: 'Lado do jardim', label: 'T0 + pátio',
    description: 'Um estúdio no rés-do-chão, nas traseiras do edifício, aberto para um pátio próprio, com um mezanino para dormir sob um pé-direito de 3,65 m.',
    about: ['O único estúdio do Borges 15 com espaço exterior privativo: um pátio de 22 m² nas traseiras, virado ao jardim. O pé-direito de 3,65 metros acolhe um mezanino para dormir de 2,5 por 3,2 metros; 48 m² mais um mezanino de 8 m², com luz de dois lados.',
     'Área e preço conforme o borges15.com (48 m² + pátio de 22 m², 549 000 €). O filme, as imagens e o modelo 3D desta casa estão em preparação.'] } },
  { id: '0b', title: 'Studio · RC-B', shortTitle: 'Studio RC-B', tagline: 'A ground-floor studio at the front entrance.', rooms: 1, outdoor: 'None',
   area: 48, outdoorArea: 0, exposure: 'Street front', label: 'T0', plan: `${base}/plans/rc-b.webp`, sourceUnits: 'Unit RC-B — T0 Front — 48 m²',
   description: 'A ground-floor studio by the front entrance. Sold.',
   about: ['A ground-floor studio by the front entrance, 48 m². borges15.com lists it as sold.'],
   pt: { title: 'Estúdio · RC-B', shortTitle: 'Estúdio RC-B', tagline: 'Um estúdio no rés-do-chão, junto à entrada principal.', outdoor: 'Nenhum', exposure: 'Frente da rua', label: 'T0',
    description: 'Um estúdio no rés-do-chão junto à entrada principal. Vendido.',
    about: ['Um estúdio no rés-do-chão junto à entrada principal, 48 m². O borges15.com indica-o como vendido.'] } },
 ],
};
