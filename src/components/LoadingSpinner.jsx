export default function LoadingSpinner({ darkMode }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: darkMode ? '#080617' : '#f5f5f5',
      }}
    >
      <div
        style={{
          width: '50px',
          height: '50px',
          border: '3px solid rgba(124, 58, 237, 0.1)',
          borderRadius: '50%',
          borderTopColor: '#7c3aed',
          animation: 'spin 1s ease-in-out infinite',
        }}
      />
    </div>
  );
}