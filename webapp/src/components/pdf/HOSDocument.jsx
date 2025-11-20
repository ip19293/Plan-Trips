import React from "react";
import { Page, Text, View, Document, StyleSheet, PDFViewer } from "@react-pdf/renderer";

// Styles
const styles = StyleSheet.create({
  page: { padding: 20 },
  table: { display: "table", width: "auto", borderStyle: "solid", borderWidth: 1, borderColor: "#000" },
  tableRow: { flexDirection: "row" },
  tableCol: { borderStyle: "solid", borderWidth: 1, borderColor: "#000", padding: 5, width: 50 },
  tableCell: { fontSize: 10 }
});

// Données
const xCoords = [1,2,3,4,5,6,7,8,9,10,11,"NON",1,2,3,4,5,6,7,8,9,10,11];
const yCoords = ["off duty","sleeper berth","driving","on duty"];

const HOSDocument = () => (
  <PDFViewer width="100%" height="600">
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={{ marginBottom: 10 }}>HOS Shell</Text>
        <View style={styles.table}>
          {/* Header X */}
          <View style={styles.tableRow}>
            <View style={styles.tableCol}><Text style={styles.tableCell}></Text></View>
            {xCoords.map((x, i) => (
              <View style={styles.tableCol} key={i}><Text style={styles.tableCell}>{x}</Text></View>
            ))}
          </View>

          {/* Rows Y */}
          {yCoords.map((y, i) => (
            <View style={styles.tableRow} key={i}>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{y}</Text></View>
              {xCoords.map((_, j) => (
                <View style={styles.tableCol} key={j}><Text style={styles.tableCell}></Text></View>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  </PDFViewer>
);

export default HOSDocument;
