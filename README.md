GoReser:

GoReser es una solución integral para la gestión hotelera robusta, escalable y eficiente. Este sistema permite centralizar la operación de un hotel, desde el control de inventario de habitaciones hasta la gestión inteligente de reservas y estados de ocupación.


Stack TecnológicoLa aplicación utiliza una arquitectura de vanguardia para asegurar el rendimiento y la mantenibilidad

Backend: Java 21 con Spring Boot 3.

Persistencia: Spring Data JPA con PostgreSQL.

Seguridad: Autenticación basada en JWT (JSON Web Tokens).

Frontend: Angular 21+ con TypeScript.

UI: Estilizado con Tailwind CSS y componentes de Angular Material.

DevOps/Infraestructura: Gestión de dependencias con Maven y arquitectura orientada a servicios.


Arquitectura de SoftwareGoReser implementa un diseño de Arquitectura Limpia (Clean Architecture) separando las responsabilidades de forma estricta

Servicios: Orquestación de casos de uso (Cálculo de tarifas dinámicas, validación de disponibilidad).

Controladores: Endpoints REST documentados que exponen los recursos al frontend.

Seguridad: Filtros de Spring Security para proteger las rutas críticas.

Antes de confirmar cualquier transacción, se verifica la intersección de intervalos de fechas:$$[CheckIn, CheckOut] \cap [Reservas Existentes]$$2. 

Ciclo de Vida de Reserva DinámicoLa reserva transiciona a través de estados controlados, garantizando la integridad de los datos


PENDING: Reserva temporal iniciada.CONFIRMED: Pago o garantía recibida.CHECKED_IN: Huésped registrado en sitio.CHECKED_OUT: 

Facturación finalizada y habitación lista para limpieza.


Configuración del ProyectoRequisitosJava Development Kit (JDK) 21.Node.js (LTS).PostgreSQL 15+.
