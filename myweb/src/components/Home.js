import React, { useEffect, useState } from 'react';

const Home = () => {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity(1);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const styles = {
    homeContainer: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundImage: `url('/acc1.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      overflow: 'hidden',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    textContainer: {
      position: 'relative',
      zIndex: 1,
      color: '#fff',
      textAlign: 'center',
      padding: '20px',
      top: '50%',
      transform: 'translateY(-50%)',
    },
    title: {
      fontSize: '3rem',
      opacity,
      transition: 'opacity 1s ease-in-out',
    },
    description: {
      fontSize: '1.2rem', // Adjusted size for description
      opacity,
      transition: 'opacity 1s ease-in-out',
    },
  };

  return (
    <div style={styles.homeContainer}>
      <div style={styles.overlay}></div>
      <div style={styles.textContainer}>
        <h1 style={styles.title}>
          Bienvenue dans PharmaPLUS,le Logiciel de gestion d’Officine.
        </h1>
        <p style={styles.description}>
          Édité par Sunsoft, en collaboration avec des pharmaciens, 
          PharmaPLUS est un outil de travail adapté spécialement pour 
          les exercices officinaux.
        </p>
      </div>
    </div>
  );
};

export default Home;
