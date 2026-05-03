export const COLORS = {
  black: "#000000", white: "#FFFFFF", grayBg: "#F8F9FA",
  grayText: "#8E8E93", border: "#EBEBEB", red: "#FF3B30", blue: "#007AFF"
};

export const COMMON_STYLE = {
  container: { maxWidth: '450px', margin: '0 auto', backgroundColor: COLORS.white, minHeight: '100vh', position: 'relative', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' },
  header: { padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${COLORS.border}`, backgroundColor: COLORS.white },
  input: { width: '100%', padding: '14px', marginBottom: '12px', borderRadius: '10px', border: `1px solid ${COLORS.border}`, boxSizing: 'border-box' },
  btnBlack: { width: '100%', padding: '16px', backgroundColor: COLORS.black, color: COLORS.white, borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer' },
  card: { marginBottom: '20px', border: `1px solid ${COLORS.border}`, borderRadius: '15px', padding: '15px', position: 'relative' },
  bottomNav: { position: 'fixed', bottom: 0, maxWidth: '450px', width: '100%', height: '65px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', backgroundColor: COLORS.white, borderTop: `1px solid ${COLORS.border}`, zIndex: 100 }
};