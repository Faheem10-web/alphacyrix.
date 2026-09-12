import React, { useState } from 'react';
import AmbientGlows from '../components/AmbientGlows';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Services from '../components/Services';
import ProjectModal from '../components/ProjectModal';
import Toast from '../components/Toast';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitSuccess = (message) => {
    setToastMessage(message);
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, 4000);
  };

  return (
    <>
      <AmbientGlows />
      <Header onOpenModal={handleOpenModal} />
      <main>
        <Hero onOpenModal={handleOpenModal} />
        <Services onOpenModal={handleOpenModal} />
      </main>
      <ProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmitSuccess={handleSubmitSuccess}
      />
      <Toast message={toastMessage} isVisible={isToastVisible} />
    </>
  );
}
