import React from 'react';
import verygood from '../images/verygood.png';
import good from '../images/good.png';
import soso from '../images/soso.png';
import bad from '../images/bad.png';
import verybad from '../images/verybad.png';

const emotions = [
    { id: 'verybad', label: '매우나쁨', imgSrc: verybad},
    { id: 'bad', label: '나쁨', imgSrc: bad },
    { id: 'soso', label: '그저그럼', imgSrc: soso },
    { id: 'good', label: '좋음', imgSrc: good },
    { id: 'verygood', label: '매우좋음', imgSrc: verygood }
];

const EmotionSelector = ({ onSelect, selectedEmotion }) => {
    return (
        <div className="emotion-selector">
            <h3>감정을 선택하세요</h3>
            <div className="emotions">
                {emotions.map((emotion) => (
                    <div
                        key={emotion.id}
                        className={`emotion ${selectedEmotion === emotion.id ? 'selected' : ''}`}
                        onClick={() => onSelect(emotion.id)}
                    >
                        <img src={emotion.imgSrc} alt={emotion.label} />
                        <span>{emotion.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EmotionSelector;
