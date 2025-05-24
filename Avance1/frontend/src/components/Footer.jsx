
// Componente funcional Footer que renderiza el pie de página del sitio.
function Footer() {
    return (
        <footer 
            className="w-full h-16 bg-blue-500 flex justify-between items-center px-5 mt-10"
        >
            {/* Sección de derechos de autor */}
            <p className="text-white">
                &copy; 2025 ComuniRed. <br /> 
                Todos los derechos reservados.
            </p>

            {/* Navegación con enlaces a otras páginas */}
            <nav>
                <ul className="text-white">
                    <li>
                        <a href="/contacto">Contacto</a> {/* Enlace a la página de contacto */}
                    </li>
                    <li>
                        <a href="/privacidad">Política de Privacidad</a> {/* Enlace a la página de política de privacidad */}
                    </li>
                </ul>
            </nav>
        </footer>      
    );
}

export default Footer;

