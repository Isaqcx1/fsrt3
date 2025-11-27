function Inicio() {
  return (
    <div>

      
      <div style={styles.hero}></div>

    
      <main style={{ padding: "40px", textAlign: "center" }}>
        <h1>Página de Inicio</h1>
        <p>Bienvenido a Urban Vibe</p>
      </main>

    </div>
  );
}

const styles = {
  hero: {
    width: "100%",
    height: "100vh", 
    backgroundImage: "url('/imgs/inicio.jpg')", 
    backgroundSize: "cover",        
    backgroundPosition: "center",   
    backgroundRepeat: "no-repeat",
  }
};

export default Inicio;
