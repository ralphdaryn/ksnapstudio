// src/pages/Contact/Contact.jsx
import "./Contact.scss";

const Contact = () => {
  return (
    <main className="contact">
      <div className="contact__inner">
        <h1 className="contact__title">Contact</h1>
        <form className="contact__form" onSubmit={(e) => e.preventDefault()}>
          <label className="contact__field">
            <span className="contact__label">Name</span>
            <input
              className="contact__input"
              type="text"
              placeholder="Your name"
            />
          </label>
          <label className="contact__field">
            <span className="contact__label">Email</span>
            <input
              className="contact__input"
              type="email"
              placeholder="you@example.com"
            />
          </label>
          <label className="contact__field">
            <span className="contact__label">Message</span>
            <textarea
              className="contact__textarea"
              rows="5"
              placeholder="Tell us about your shoot..."
            />
          </label>
          <button className="contact__btn" type="submit">
            Send
          </button>
        </form>
      </div>
    </main>
  );
};
export default Contact;