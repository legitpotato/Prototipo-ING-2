import nodemailer from "nodemailer";

//Sacar informacion del desde la pagina https://ethereal.email/create
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'karli72@ethereal.email',
      pass: 'VCnnEyJckCs6gUDt21'
  },
    //debug: true, // Habilitar depuración
    //logger: true, // Habilitar logs
});

//Funcion para envviar correos
const sendMail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
        from: 'karli72@ethereal.email', //Aqui va el correo que te da la pagina
        to: 'karli72@ethereal.email', //Aqui va la contraseña que te da la pagina
        subject: 'Bienvenido a la Biblioteca :D', 
        html: `Hola!!
        <br>Gracias por registrarte en Biblioteca Estación Central
        <br>Su correo a sido verificado con exito
        <br>
        <br>Esperamos que tengas una experiencia agradable en nuestro establecimiento`,
    });
    console.log('Correo enviado con éxito');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
};

export default sendMail;