import React, { useState } from 'react';
import { CheckCircle, Clock, Mail, MapPin } from 'lucide-react';

const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const isValid =
      name.trim() !== '' &&
      email.trim() !== '' &&
      subject.trim() !== '' &&
      message.trim() !== '';

    if (!isValid) {
      setShowValidation(true);
      setSubmitted(false);
      return;
    }

    setSubmitted(true);
    setShowValidation(false);
  };

  return (
    <div>
      <section className="bg-gray-50 py-12 px-4 text-center mb-0">
        <h1 className="font-bold text-3xl text-gray-900">Contact Us</h1>
        <p className="text-gray-500 mt-2">We'd love to hear from you</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto px-4 py-16">
        <div>
          <h2 className="font-bold text-2xl text-gray-900 mb-6">Get in Touch</h2>

          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900 text-sm">Email Us</p>
                <p className="text-gray-600 text-sm">info@kagoj.com</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900 text-sm">Find Us</p>
                <p className="text-gray-600 text-sm">123 Stationery Lane, Dhaka, Bangladesh</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900 text-sm">Working Hours</p>
                <p className="text-gray-600 text-sm">Mon-Sat, 9am-6pm</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-lg text-gray-900 mb-4">Send us a message</h2>

          {submitted && (
            <div className="mb-4 flex items-start gap-2 rounded-sm border border-green-200 bg-green-50 p-3">
              <CheckCircle className="mt-0.5 h-5 w-5 text-green-600" />
              <p className="text-sm text-green-700">
                Thank you! We will get back to you within 24 hours.
              </p>
            </div>
          )}

          {showValidation && (
            <p className="mb-4 text-sm text-red-600">Please fill in all fields.</p>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="contact-name" className="mb-1 block text-sm font-medium text-gray-900">
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="mb-1 block text-sm font-medium text-gray-900">
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>

            <div>
              <label htmlFor="contact-subject" className="mb-1 block text-sm font-medium text-gray-900">
                Subject
              </label>
              <input
                id="contact-subject"
                type="text"
                required
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="mb-1 block text-sm font-medium text-gray-900">
                Message
              </label>
              <textarea
                id="contact-message"
                rows={5}
                required
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-sm bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
