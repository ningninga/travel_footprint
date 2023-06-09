import { useState } from "react";
import './updateform.css'

function UpdateForm({ pin, onUpdate, onClose }) {
    const [imageUrl, setImageUrl] = useState(pin.imageUrl)
    const [title, setTitle] = useState(pin.title);
    const [desc, setDesc] = useState(pin.desc);
    const [rating, setRating] = useState(pin.rating);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedPin = {
            ...pin,
            title,
            desc,
            rating,
            imageUrl,
        };

        try {
            onUpdate(updatedPin);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="update-form">
            <form onSubmit={handleSubmit} >
                <label>Select A Photo</label>
                <input className="image-input" type='file' accept='image/*' onChange={(e) => setImageUrl(e.target.files[0])} />
                <label>Title</label>
                <input placeholder="Enter a title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <label>Review</label>
                <textarea placeholder="Tell us something about it" value={desc} onChange={(e) => setDesc(e.target.value)} />
                <label>Rating</label>
                <select value={rating} onChange={(e) => setRating(e.target.value)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
                <div className="buttonContainer">
                    <button className='updateButton' type="submit">Update Pin</button>
                    <button className='cancelButton' onClick={onClose}>Cancel</button>
                </div>

            </form>
        </div>
    );
}

export default UpdateForm;
