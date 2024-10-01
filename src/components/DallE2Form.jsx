import React from 'react';

const DallE2Form = () => {
  return (
    <div>
      <h1>DALL-E 2 Form</h1>
      <form>
        {/* Lomake DALL-E 2:lle */}
        <input type="text" placeholder="Syötä jotain DALL-E 2:lle" />
        <button type="submit">Lähetä</button>
      </form>
    </div>
  );
};

export default DallE2Form;
