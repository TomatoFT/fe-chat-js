# Component Hiển thị Tiến trình AI

Một hiển thị tiến trình đa bước tinh vi mô phỏng quá trình suy nghĩ của AI trong khi chờ phản hồi từ backend. Component này cung cấp trải nghiệm người dùng hấp dẫn trong thời gian chờ đợi bằng cách hiển thị tiến trình hoạt động qua các giai đoạn xử lý khác nhau.

## Tính năng

### Thiết kế Trực quan
- **4 Giai đoạn Xử lý**: SUY NGHĨ → TÌM KIẾM → KẾT HỢP DỮ LIỆU → TẠO CÂU TRẢ LỜI
- **Biểu tượng Tròn**: Mỗi giai đoạn được đại diện bởi một biểu tượng riêng biệt với mã màu
- **Chỉ báo TRUNG TÂM THÔNG TIN**: Chỉ báo hình kim cương ở trên cùng với hiệu ứng hoạt ảnh
- **Quản lý Trạng thái**: Không hoạt động (xám), Hoạt động (sáng với phát sáng), Hoàn thành (đặc với dấu tích)

### Hành vi Hoạt ảnh
- **Thời gian Thích ứng**: Điều chỉnh tốc độ hoạt ảnh dựa trên thời gian phản hồi thực tế vs dự kiến
- **Chuyển tiếp Mượt mà**: Chuyển tiếp 0.5-1 giây giữa các giai đoạn
- **Hiệu ứng Trực quan**: Hoạt ảnh nhấp nháy, phát sáng, lấp lánh và xoay
- **Hoàn thành Tiến trình**: Biểu tượng sáng lên tuần tự từ trái sang phải

### Logic Thời gian
- **Thời lượng Dự kiến**: 3 phút (180 giây) tổng cộng
- **Thời lượng Giai đoạn**: 45 giây mỗi giai đoạn (phân bổ đều)
- **Phản hồi Sớm**: Tăng tốc hoạt ảnh còn lại nếu backend phản hồi sớm
- **Phản hồi Muộn**: Giữ giai đoạn cuối nhấp nháy cho đến khi phản hồi đến

## Usage

### Basic Implementation

```tsx
import { AIProgressVisualization } from './AIProgressVisualization';

function ChatInterface() {
  const [showProgress, setShowProgress] = useState(false);
  const [actualDuration, setActualDuration] = useState<number | undefined>();

  const handleSendMessage = async () => {
    setShowProgress(true);
    // ... send message logic
    
    // When response arrives
    const responseTime = Date.now() - startTime;
    setActualDuration(responseTime / 1000);
  };

  return (
    <AIProgressVisualization
      isVisible={showProgress}
      expectedDuration={180}
      actualDuration={actualDuration}
      onComplete={() => setShowProgress(false)}
    />
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isVisible` | `boolean` | - | Controls visibility of the progress visualization |
| `expectedDuration` | `number` | `180` | Expected response time in seconds (3 minutes) |
| `actualDuration` | `number \| undefined` | `undefined` | Actual response time in seconds |
| `onComplete` | `() => void` | - | Callback fired when all stages complete |

### Integration with Chat Interface

The component is designed to replace traditional typing indicators in chat interfaces:

```tsx
// Before: Simple typing indicator
{isTyping && <TypingIndicator />}

// After: Rich progress visualization
<AIProgressVisualization
  isVisible={showProgressVisualization}
  expectedDuration={180}
  actualDuration={actualResponseTime}
  onComplete={() => {
    // Handle completion
  }}
/>
```

## Styling

The component includes custom CSS animations and transitions:

- **Fade-in animations** for smooth appearance
- **Pulse-glow effects** for active stages
- **Shimmer effects** for visual appeal
- **Connection line animations** between stages
- **Responsive design** for all screen sizes

## Customization

### Stage Configuration

Stages can be customized by modifying the `STAGES` array:

```tsx
const STAGES: StageConfig[] = [
  {
    id: 'think',
    label: 'THINK',
    icon: <Brain className="w-6 h-6" />,
    color: 'bg-blue-500',
    duration: 45
  },
  // ... other stages
];
```

### Color Themes

Each stage has its own color theme:
- **THINK**: Blue (`bg-blue-500`)
- **QUERY**: Purple (`bg-purple-500`)
- **COMBINE DATA**: Green (`bg-green-500`)
- **GENERATE ANSWER**: Orange (`bg-orange-500`)

## Demo Component

A standalone demo component is available for testing:

```tsx
import { ProgressVisualizationDemo } from './ProgressVisualizationDemo';

// Use in your app for testing
<ProgressVisualizationDemo />
```

## Technical Details

### Animation Timing
- Uses Framer Motion for smooth animations
- Calculates stage durations dynamically based on actual response time
- Handles edge cases for very fast or very slow responses

### Performance
- Lightweight component with minimal re-renders
- Efficient animation loops with proper cleanup
- Responsive design with CSS Grid and Flexbox

### Accessibility
- Semantic HTML structure
- Proper ARIA labels for screen readers
- Keyboard navigation support
- High contrast color schemes

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- Framer Motion compatibility
- ES6+ JavaScript features

## Dependencies

- React 18+
- Framer Motion 10+
- Lucide React (for icons)
- Tailwind CSS (for styling)

## Future Enhancements

- [ ] Sound effects for stage transitions
- [ ] Customizable stage icons and labels
- [ ] Progress percentage display
- [ ] Multiple animation themes
- [ ] Integration with WebSocket for real-time updates
