.app {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 250px;
  background-color: #000000;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: width 0.3s;
}

.logo-container {
  display: flex;
  align-items: center;
  padding: 20px;
}

.logo {
  width: 200px; /* ajustez la largeur selon vos besoins */
  height: auto; /* pour conserver les proportions de l'image */
}


.navigation {
  flex-grow: 1;
}

.nav-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-link {
  display: block;
  padding: 15px 20px;
  text-decoration: none;
  color: white;
  transition: background-color 0.3s;
}

.nav-link:hover, .nav-link.active {
  background-color: #282828;
}

.sidebar-footer {
  padding: 20px;
  background: #000000;
}

.footer-link {
  display: block;
  color: white;
  text-decoration: none;
  margin-bottom: 10px;
}



.header {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

/* Style de base inchangé */

/* Améliorations pour la responsivité */
@media screen and (max-width: 768px) {
  .sidebar {
    position: fixed;
    width: 80%;
    max-width: 300px; /* Limite la largeur sur très petits écrans */
    height: 100vh;
    transform: translateX(-100%);
    transition: transform 0.3s ease-in-out;
  }

  .sidebar.active {
    transform: translateX(0);
  }

  .hamburger-menu {
    position: fixed;
    top: 15px;
    left: 15px;
    z-index: 2; /* S'assurer qu'il est au-dessus de tout autre contenu */
    color: rgb(255, 124, 1);
  }

  .content, .header {
    margin-left: 0 !important; /* Annuler les marges lorsque la barre latérale est cachée */
  }
  
  /* Augmentation de la taille des icônes pour une meilleure accessibilité */
  .nav-link i, .footer-link i {
    font-size: 20px;
    margin-right: 10px;
  }

  /* Ajustement des tailles de texte pour une meilleure lisibilité */
  .nav-link, .footer-link {
    font-size: 16px;
  }
}




/*/////*/

/* Base and unchanged styles */

/* Responsive styles for smaller screens */
@media screen and (max-width: 768px) {
  /* Full-width sidebar overlay for mobile devices */
  .sidebar {
    width: 100%; /* Make sidebar full-width */
    height: 100%; /* Full height to cover all viewport */
    position: fixed;
    top: 0;
    left: 0;
    transform: translateX(-100%); /* Start off-screen */
    transition: transform 0.3s ease-in-out;
  }

  /* When the sidebar is open */
  .sidebar.active {
    transform: translateX(0); /* Bring sidebar on-screen */
  }

  /* Hamburger menu icon placement */
  .hamburger-menu {
    display: block; /* Only shown on mobile */
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 1001; /* Above sidebar */
    background: transparent;
    border: none;
    font-size: 24px;
  }

  /* Adjust content when sidebar is open */
  .content {
    transition: margin-left 0.3s ease-in-out;
  }

  .content.sidebar-open {
    margin-left: 250px; /* Make space for the sidebar */
  }
  
  /* Adjust icon size and padding for better touch */
  .nav-link i {
    font-size: 24px;
    padding: 15px;
  }

  /* Optional: Adjust font size for better readability on small screens */
  .nav-link, .footer-link {
    font-size: 16px;
  }
}

/* Additional media query for very small screens like small smartphones */
@media screen and (max-width: 480px) {
  .hamburger-menu {
    font-size: 30px; /* Larger touch target for hamburger menu */
  }

  /* Optional: Further adjustments for icon size and padding */
  .nav-link i {
    font-size: 20px; /* Slightly smaller icons for very small screens */
    padding: 12px;
  }
}

@media screen and (min-width: 769px) {
  .hamburger-menu {
    display: none;
  }
}


