import React from 'react';
import ImagePlaceholder from '../../../components/ImagePlaceholder';
import SparklesIcon from '../../../components/icons/SparklesIcon';
import UploadIcon from '../../../components/icons/UploadIcon';

interface FashionTryOnInputProps {
  modelImage: string | null;
  modelImageType: string | null;
  garmentImage: string | null;
  garmentImageType: string | null;
  accessoryImage: string | null;
  accessoryImageType: string | null;
  handheldImage: string | null;
  handheldImageType: string | null;
  contextPrompt: string;
  pose: string;
  aspectRatio: string;
  detailedPrompt: string;
  isLoading: boolean;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>, type: 'model' | 'garment' | 'accessory' | 'handheld') => void;
  onContextChange: (value: string) => void;
  onPoseChange: (value: string) => void;
  onAspectRatioChange: (value: string) => void;
  onDetailedPromptChange: (value: string) => void;
  onSubmit: () => void;
}

const backgroundSuggestions = [
  'trên đường phố London',
  'trên bãi biển lúc hoàng hôn',
  'trên sân thượng của tòa nhà lớn',
  'cạnh một chiếc siêu xe thể thao',
  'trong một quán bar sang trọng',
  'giữa một khu vườn Nhật Bản',
  'tại một sự kiện thảm đỏ',
  'trong một thư viện cổ kính',
  'trên một con phố mua sắm ở Paris',
  'giữa cánh đồng hoa oải hương',
  'tại một ga tàu điện ngầm hiện đại',
  'trong một quán cà phê ấm cúng',
  'trên một du thuyền sang trọng',
  'trước một tác phẩm nghệ thuật graffiti',
  'trong một khu rừng huyền bí',
  'tại một lễ hội âm nhạc ngoài trời',
  'trên một cây cầu nhìn ra thành phố',
  'trong một phòng trưng bày nghệ thuật',
  'trên đỉnh núi tuyết',
  'giữa một khu chợ đêm sôi động'
];

const poseSuggestions = [
    'Để AI tự quyết định',
    'Đứng thẳng',
    'Ngồi trên ghế',
    'Đang đi bộ tự tin',
    'Nằm thư giãn trên cỏ',
    'Dựa vào tường gạch',
    'Khoanh tay trước ngực',
    'Chống tay lên hông',
    'Nhảy lên không trung',
    'Chạy bộ nhẹ nhàng',
    'Đang khiêu vũ',
    'Ngồi xổm (Squat)',
    'Tư thế Yoga cây',
    'Nhìn qua vai',
    'Ngồi trên bậc thang'
];

const aspectRatios = ['1:1', '9:16', '16:9', '4:5', '3:4', '4:3'];

const ImageUploadField: React.FC<{
  id: string;
  image: string | null;
  imageType: string | null;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
  subtitle: string;
}> = ({ id, image, imageType, onChange, title, subtitle }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-semibold mb-2 text-gray-300">
            {title} <span className="text-gray-400 font-normal">{subtitle}</span>
        </label>
        <div className="w-full aspect-square bg-gray-900/50 rounded-xl flex items-center justify-center relative group">
            <input
                type="file"
                id={id}
                accept="image/*"
                onChange={onChange}
                className="hidden"
            />
            <label
                htmlFor={id}
                className="w-full h-full cursor-pointer flex items-center justify-center"
                aria-label={title}
            >
                {image ? (
                <img
                    src={`data:${imageType};base64,${image}`}
                    alt={title}
                    className="object-contain w-full h-full rounded-xl"
                />
                ) : (
                <ImagePlaceholder label={title} icon={<UploadIcon className="w-8 h-8" />} />
                )}
            </label>
        </div>
    </div>
);

const FashionTryOnInput: React.FC<FashionTryOnInputProps> = ({
  modelImage,
  modelImageType,
  garmentImage,
  garmentImageType,
  accessoryImage,
  accessoryImageType,
  handheldImage,
  handheldImageType,
  contextPrompt,
  pose,
  aspectRatio,
  detailedPrompt,
  isLoading,
  onImageChange,
  onContextChange,
  onPoseChange,
  onAspectRatioChange,
  onDetailedPromptChange,
  onSubmit,
}) => {
  const isSubmitDisabled = isLoading || !modelImage || !garmentImage;

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-800 rounded-2xl shadow-lg">
        <div>
            <h3 className="block text-lg font-semibold mb-3 text-gray-300">
                1. Tải ảnh (Tối đa 4 ảnh)
            </h3>
            <div className="grid grid-cols-2 gap-4">
                <ImageUploadField 
                    id="model-image-upload"
                    image={modelImage}
                    imageType={modelImageType}
                    onChange={(e) => onImageChange(e, 'model')}
                    title="Người mẫu"
                    subtitle="(Bắt buộc)"
                />
                <ImageUploadField 
                    id="garment-image-upload"
                    image={garmentImage}
                    imageType={garmentImageType}
                    onChange={(e) => onImageChange(e, 'garment')}
                    title="Trang phục"
                    subtitle="(Bắt buộc)"
                />
                <ImageUploadField 
                    id="accessory-image-upload"
                    image={accessoryImage}
                    imageType={accessoryImageType}
                    onChange={(e) => onImageChange(e, 'accessory')}
                    title="Phụ kiện"
                    subtitle="(Tùy chọn)"
                />
                <ImageUploadField 
                    id="handheld-image-upload"
                    image={handheldImage}
                    imageType={handheldImageType}
                    onChange={(e) => onImageChange(e, 'handheld')}
                    title="Vật phẩm cầm tay"
                    subtitle="(Tùy chọn)"
                />
            </div>
        </div>
        
        <div>
            <label htmlFor="pose-select" className="block text-lg font-semibold mb-2 text-gray-300">
                2. Gợi ý tạo dáng (Tùy chọn)
            </label>
            <select
                id="pose-select"
                value={pose}
                onChange={(e) => onPoseChange(e.target.value)}
                className="w-full p-3 bg-gray-700 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors duration-200"
                aria-label="Chọn tư thế tạo dáng"
            >
                {poseSuggestions.map((suggestion) => (
                    <option key={suggestion} value={suggestion === 'Để AI tự quyết định' ? '' : suggestion}>
                        {suggestion}
                    </option>
                ))}
            </select>
        </div>

        <div>
            <label htmlFor="context-prompt-input" className="block text-lg font-semibold mb-2 text-gray-300">
                3. Thêm bối cảnh (Tùy chọn)
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
                 <input
                    id="context-prompt-input"
                    type="text"
                    value={contextPrompt}
                    onChange={(e) => onContextChange(e.target.value)}
                    placeholder="ví dụ: 'trên đường phố Paris'"
                    className="w-full p-3 bg-gray-700 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors duration-200"
                    aria-label="Nhập bối cảnh tùy chỉnh"
                />
                <select
                    onChange={(e) => {
                      if (e.target.value) onContextChange(e.target.value);
                    }}
                    className="w-full sm:w-auto p-3 bg-gray-700 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors duration-200"
                    aria-label="Chọn bối cảnh gợi ý"
                    value=""
                >
                    <option value="" disabled>Chọn gợi ý</option>
                    {backgroundSuggestions.map((suggestion) => (
                        <option key={suggestion} value={suggestion}>
                            {suggestion}
                        </option>
                    ))}
                </select>
            </div>
        </div>
        
        <div>
          <label className="block text-lg font-semibold mb-2 text-gray-300">
            4. Chọn tỷ lệ khung hình
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {aspectRatios.map((ratio) => (
              <button
                key={ratio}
                onClick={() => onAspectRatioChange(ratio)}
                className={`py-2 px-3 text-sm font-semibold rounded-lg transition-colors ${
                  aspectRatio === ratio
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="detailed-prompt-input" className="block text-lg font-semibold mb-2 text-gray-300">
            5. Mô tả chi tiết (Không bắt buộc)
          </label>
          <textarea
            id="detailed-prompt-input"
            value={detailedPrompt}
            onChange={(e) => onDetailedPromptChange(e.target.value)}
            placeholder="ví dụ: 'thay đổi màu áo thành màu xanh dương, thêm họa tiết ngôi sao'"
            className="w-full h-24 p-4 bg-gray-700 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors duration-200 resize-none"
            aria-label="Nhập mô tả chi tiết"
          />
        </div>
     
      <button
        onClick={onSubmit}
        disabled={isSubmitDisabled}
        className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl shadow-lg hover:from-pink-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isLoading ? 'Đang xử lý...' : 'Thử trang phục'}
        {!isLoading && <SparklesIcon className="w-5 h-5" />}
      </button>
    </div>
  );
};

export default FashionTryOnInput;