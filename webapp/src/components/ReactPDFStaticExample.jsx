import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
} from '@react-pdf/renderer';
import HOSDocument from "./pdf/HOSDocument";

// Exemple d'utilisation de react-pdf/renderer avec des données statiques
// Focus: design (mise en page moderne, couleurs, typographie, header/footer, grille)

// (Optionnel) Enregister une fonte web si vous avez le fichier ou l'url
// Font.register({ family: 'Open Sans', src: 'https://fonts.gstatic.com/s/opensans/v18/mem8YaGs126MiZpBA-UFVZ0e.woff2' });

// Données statiques (à remplacer ou étendre)
const DATA = {
  title: 'Rapport de Design — Exemple statique',
  subtitle: 'Stylisation moderne avec react-pdf/renderer',
  author: 'Équipe Design',
  date: '20 novembre 2025',
  sections: [
    {
      heading: 'Résumé',
      body:
        "Ce document montre un style cohérent : en-tête coloré, grille à deux colonnes, cartes d'information et pied de page avec pagination.",
    },
    {
      heading: 'Détails du projet',
      body:
        "Utilisation de composants réutilisables, styles centralisés via StyleSheet, et mise en avant typographique pour la hiérarchie visuelle.",
    },
    {
      heading: 'Conclusion',
      body:
        "Le style ici est statique mais peut être alimenté dynamiquement par des props ou une API. Le focus est sur une lecture claire et un rendu professionnel.",
    },
  ],
  stats: [
    { label: 'Pages', value: '3' },
    { label: 'Éléments', value: '12' },
    { label: 'Score', value: '92%' },
  ],
};

// Styles : couleurs, espacements, typographie
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 40,
    lineHeight: 1.4,
    backgroundColor: '#ffffff',
  },
  // Header
  header: {
    position: 'absolute',
    top: 20,
    left: 40,
    right: 40,
    height: 60,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e6e9ef',
    paddingBottom: 8,
  },
  logoRow: { display: 'flex', flexDirection: 'row', alignItems: 'center' },
  logoBox: {
    width: 46,
    height: 46,
    borderRadius: 6,
    backgroundColor: '#0f766e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    marginRight: 12,
  },
  titleHeader: { fontSize: 14, fontWeight: 700 },
  headerMeta: { fontSize: 9, color: '#6b7280' },

  // Content
  content: { marginTop: 20, flexDirection: 'row' },
  leftCol: { width: '62%', paddingRight: 12 },
  rightCol: {
    width: '38%',
    paddingLeft: 12,
    borderLeftWidth: 1,
    borderLeftColor: '#f1f5f9',
  },

  // Card / section
  section: { marginBottom: 12 },
  sectionHeading: { fontSize: 12, fontWeight: 700, marginBottom: 6 },
  paragraph: { fontSize: 10, color: '#111827', textAlign: 'justify' },

  // Stat card
  statCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  statRow: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' },
  statLabel: { fontSize: 9, color: '#6b7280' },
  statValue: { fontSize: 13, fontWeight: 700 },

  // Small card / image
  imagePlaceholder: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    backgroundColor: '#e6eef0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e6e9ef',
    paddingTop: 8,
  },
  pageNumber: { fontSize: 9, color: '#6b7280' },
});

// Composant réutilisable: Header (logo + title + meta)
const Header = ({ title, subtitle, author, date }) => (
  <View style={styles.header} fixed>
    <View style={styles.logoRow}>
      <View style={styles.logoBox}>
        <Text style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>D</Text>
      </View>
      <View>
        <Text style={styles.titleHeader}>{title}</Text>
        <Text style={styles.headerMeta}>{subtitle}</Text>
      </View>
    </View>
    <View style={{ textAlign: 'right' }}>
      <Text style={styles.headerMeta}>{author}</Text>
      <Text style={styles.headerMeta}>{date}</Text>
    </View>
  </View>
);

// Composant: Footer (pagination)
// const Footer = ({ pageNumber, totalPages }) => (
//   <View style={styles.footer} fixed>
//     <Text style={styles.pageNumber}>© {DATA.author} — {new Date().getFullYear()}</Text>
//     <Text style={styles.pageNumber}>Page {pageNumber} / {totalPages}</Text>
//   </View>
// );

// Document principal
const MyStyledPDF = () => (
  <Document>
    <Page size="A4" style={styles.page} wrap>
      <Header
        title={DATA.title}
        subtitle={DATA.subtitle}
        author={DATA.author}
        date={DATA.date}
      />
<HOSDocument />

    </Page>

  </Document>
);

// Composant principal exporté pour l'application React
export default function ReactPDFStaticExample() {
  return (
    <div>
      <h2>Exemple react-pdf/renderer — style statique</h2>
      <p>Cliquer pour télécharger le PDF généré côté client (navigateur).</p>
      <PDFDownloadLink document={<MyStyledPDF />} fileName="rapport-design.pdf">
        {({ blob, url, loading, error }) => (loading ? 'Génération...' : 'Télécharger le PDF')}
      </PDFDownloadLink>

      {/* Optionnel: si vous utilisez @react-pdf/renderer/renderer web viewer vous pouvez afficher <PDFViewer> */}
    </div>
  );
}

// --- FULL DRIVER DAILY LOG TEMPLATE (Exact Layout Matching Image) --- by Driver Daily Log Layout ---

// Below is a revised PDF structure closely matching the visual style of the Driver's Daily Log sheet you uploaded.
// Clean boxes, grid lines, labeled fields, hourly timeline bar, and structured form layout.

// const LogStyles = StyleSheet.create({
//   page: {
//     fontFamily: 'Helvetica',
//     fontSize: 10,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: 700,
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 4,
//   },
//   box: {
//     borderWidth: 1,
//     borderColor: '#000',
//     padding: 4,
//     fontSize: 9,
//   },
//   label: {
//     fontSize: 8,
//     marginBottom: 2,
//   },
//   timelineRow: {
//     flexDirection: 'row',
//     borderWidth: 1,
//     borderColor: '#000',
//     marginTop: 10,
//   },
//   hourCell: {
//     width: '4.16%',
//     borderLeftWidth: 1,
//     borderColor: '#000',
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//     fontSize: 6,
//   },
//   remarksBox: {
//     borderWidth: 1,
//     height: 90,
//     marginTop: 12,
//     padding: 4,
//   },
// });

// const DriversDailyLogPDF = () => (
//   <Document>
//     <Page size="A4" style={LogStyles.page}>
//       <Text style={LogStyles.title}>DRIVER'S DAILY LOG</Text>
//
//       {/* Top Fields */}
//       <View style={LogStyles.row}>
//         <View style={{ width: '32%' }}>
//           <Text style={LogStyles.label}>From:</Text>
//           <Text style={LogStyles.box}>City Name</Text>
//         </View>
//         <View style={{ width: '32%' }}>
//           <Text style={LogStyles.label}>To:</Text>
//           <Text style={LogStyles.box}>Destination</Text>
//         </View>
//         <View style={{ width: '32%' }}>
//           <Text style={LogStyles.label}>Date</Text>
//           <Text style={LogStyles.box}>MM / DD / YYYY</Text>
//         </View>
//       </View>
//
//       {/* Mileage & Carrier Info */}
//       <View style={LogStyles.row}>
//         <View style={{ width: '48%' }}>
//           <Text style={LogStyles.label}>Total Miles Driving Today</Text>
//           <Text style={LogStyles.box}>000</Text>
//         </View>
//         <View style={{ width: '48%' }}>
//           <Text style={LogStyles.label}>Total Mileage Today</Text>
//           <Text style={LogStyles.box}>000</Text>
//         </View>
//       </View>
//
//       <View style={LogStyles.row}>
//         <View style={{ width: '48%' }}>
//           <Text style={LogStyles.label}>Truck / Trailer Number</Text>
//           <Text style={LogStyles.box}>ABC-123</Text>
//         </View>
//         <View style={{ width: '48%' }}>
//           <Text style={LogStyles.label}>Carrier Name</Text>
//           <Text style={LogStyles.box}>Carrier Example</Text>
//         </View>
//       </View>
//
//       {/* Timeline */}
//       <Text style={{ marginTop: 10, fontSize: 9 }}>24-Hour Grid</Text>
//       <View style={LogStyles.timelineRow}>
//         {Array.from({ length: 24 }).map((_, i) => (
//           <View key={i} style={LogStyles.hourCell}>
//             <Text>{i}</Text>
//           </View>
//         ))}
//       </View>
//
//       {/* Remarks */}
//       <Text style={{ marginTop: 10, fontSize: 9 }}>Remarks</Text>
//       <View style={LogStyles.remarksBox}>
//         <Text>Notes, events, stops, inspections...</Text>
//       </View>
//
//       {/* Shipping Documents */}
//       <Text style={{ marginTop: 10, fontSize: 9 }}>Shipping Documents</Text>
//       <View style={LogStyles.box}>
//         <Text>Document numbers, shipper, commodity...</Text>
//       </View>
//     </Page>
//   </Document>
// );


// --- FULL DRIVER DAILY LOG TEMPLATE v2 (Based on Uploaded PDF) ---
// This version recreates the structure: header fields, 24h grid, duty lines, remarks, shipping documents, recap tables.

// const LogFullTemplate = () => (
//   <Document>
//     <Page size="A4" style={LogStyles.page}>
//
//       {/* Title Row */}
//       <Text style={{ fontSize: 16, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>
//         DRIVER'S DAILY LOG
//       </Text>
//       <Text style={{ textAlign: 'center', fontSize: 8 }}>(24 Hours)</Text>
//
//       {/* Date Row */}
//       <View style={LogStyles.row}>
//         <View style={{ width: '30%' }}>
//           <Text style={LogStyles.label}>Month</Text>
//           <Text style={LogStyles.box}></Text>
//         </View>
//         <View style={{ width: '30%' }}>
//           <Text style={LogStyles.label}>Day</Text>
//           <Text style={LogStyles.box}></Text>
//         </View>
//         <View style={{ width: '30%' }}>
//           <Text style={LogStyles.label}>Year</Text>
//           <Text style={LogStyles.box}></Text>
//         </View>
//       </View>
//
//       {/* From / To Row */}
//       <View style={LogStyles.row}>
//         <View style={{ width: '48%' }}>
//           <Text style={LogStyles.label}>From:</Text>
//           <Text style={LogStyles.box}></Text>
//         </View>
//         <View style={{ width: '48%' }}>
//           <Text style={LogStyles.label}>To:</Text>
//           <Text style={LogStyles.box}></Text>
//         </View>
//       </View>
//
//       {/* Mileage / Carrier Section */}
//       <View style={LogStyles.row}>
//         <View style={{ width: '48%' }}>
//           <Text style={LogStyles.label}>Total Miles Driving Today</Text>
//           <Text style={LogStyles.box}></Text>
//         </View>
//         <View style={{ width: '48%' }}>
//           <Text style={LogStyles.label}>Total Mileage Today</Text>
//           <Text style={LogStyles.box}></Text>
//         </View>
//       </View>
//
//       <View style={LogStyles.row}>
//         <View style={{ width: '48%' }}>
//           <Text style={LogStyles.label}>Truck / Tractor & Trailer Numbers</Text>
//           <Text style={LogStyles.box}></Text>
//         </View>
//         <View style={{ width: '48%' }}>
//           <Text style={LogStyles.label}>Name of Carrier / Address</Text>
//           <Text style={LogStyles.box}></Text>
//         </View>
//       </View>
//
//       {/* DUTY STATUS LINES */}
//       <Text style={{ marginTop: 10, fontSize: 10, fontWeight: 700 }}>Duty Status</Text>
//       <View>
//         {['1. Off Duty', '2. Sleeper Berth', '3. Driving', '4. On Duty (Not Driving)'].map((label, i) => (
//           <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
//             <Text style={{ width: '25%', fontSize: 9 }}>{label}</Text>
//             <View style={{ flex: 1, height: 22, borderWidth: 1, borderColor: '#000' }}></View>
//           </View>
//         ))}
//       </View>
//
//       {/* 24‑HOUR GRID */}
//       <Text style={{ marginTop: 8, fontSize: 9 }}>24‑Hour Grid</Text>
//       <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#000', height: 60 }}>
//         {Array.from({ length: 24 }).map((_, hour) => (
//           <View key={hour} style={{ flex: 1, borderLeftWidth: 1, borderColor: '#000', alignItems: 'center' }}>
//             <Text style={{ fontSize: 6 }}>{hour}</Text>
//           </View>
//         ))}
//       </View>
//
//       {/* REMARKS */}
//       <Text style={{ marginTop: 10, fontSize: 10 }}>Remarks</Text>
//       <View style={{ borderWidth: 1, height: 80, marginBottom: 10 }}></View>
//
//       {/* SHIPPING */}
//       <Text style={{ fontSize: 10 }}>Shipping Documents</Text>
//       <View style={{ borderWidth: 1, height: 55 }}></View>
//
//       {/* RECAP TABLES */}
//       <Text style={{ marginTop: 10, fontSize: 10, fontWeight: 700 }}>Recap</Text>
//       <View style={{ borderWidth: 1 }}>
//         <Text style={{ padding: 4, fontSize: 8 }}>On Duty Hours (last 7 or 8 days)</Text>
//         <View style={{ flexDirection: 'row' }}>
//           {[...Array(8)].map((_, i) => (
//             <View key={i} style={{ flex: 1, borderLeftWidth: 1, borderColor: '#000', height: 20 }}></View>
//           ))}
//         </View>
//       </View>
//
//     </Page>
//   </Document>
// );


// TODO: Full pixel-perfect integration requested. Next step: expand tables, recap, and bottom sections.

