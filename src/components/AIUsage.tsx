import React, { useState } from "react";

interface AIUsagePageProps {
  onClose: () => void;
}

const sections = [
  {
    id: 1,
    title: "1️⃣ Mô hình AI được sử dụng",
    icon: "🤖",
    color: "from-blue-500 to-indigo-600",
    content: (
      <>
        <p>
          Ứng dụng này sử dụng <strong>ChatGPT (GPT-5, OpenAI)</strong> làm AI
          phân tích chính, kết hợp với <strong>Groq LLaMA-3.1-70B</strong> trong
          các mô phỏng kinh tế – tài chính nâng cao.
        </p>
        <ul className="list-disc pl-6 mt-2">
          <li>💡 Phân tích hành vi dòng vốn & quyền lực tài chính.</li>
          <li>📘 Dữ liệu huấn luyện từ nguồn công khai và học thuật.</li>
          <li>
            ⚠️ Kết quả chỉ mang tính mô phỏng, không phải tư vấn tài chính.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 2,
    title: "2️⃣ Kiểm chứng & nguồn tham khảo",
    icon: "🔍",
    color: "from-teal-500 to-emerald-500",
    content: (
      <>
        <p>
          Mọi thông tin được đối chiếu với các nguồn{" "}
          <strong>chính thống và học thuật</strong>:
        </p>
        <ul className="list-disc pl-6 mt-2">
          <li>🏛️ Bộ Kế hoạch và Đầu tư (MPI) – Báo cáo Kinh tế-Xã hội.</li>
          <li>💵 Ngân hàng Nhà nước Việt Nam – Thống kê tài chính.</li>
          <li>🌐 IMF, WEF, UNCTAD – Báo cáo quyền lực tài chính toàn cầu.</li>
          <li>📚 Tạp chí học thuật như *Vietnam Economic Review*.</li>
        </ul>
      </>
    ),
  },
  {
    id: 3,
    title: "3️⃣ Cam kết liêm chính & minh bạch",
    icon: "🛡️",
    color: "from-indigo-600 to-purple-600",
    content: (
      <>
        <p>
          Nhóm phát triển cam kết tuân thủ{" "}
          <strong>liêm chính học thuật và đạo đức AI</strong>:
        </p>
        <ul className="list-disc pl-6 mt-2">
          <li>📖 Trích dẫn rõ ràng mọi nguồn dữ liệu và ý tưởng.</li>
          <li>🚫 Không đạo văn hoặc bóp méo kết quả phân tích.</li>
          <li>🧩 Khuyến khích phản biện học thuật và cải tiến minh bạch.</li>
          <li>🔒 Không lưu trữ hoặc thu thập dữ liệu người dùng.</li>
        </ul>
      </>
    ),
  },
  {
    id: 4,
    title: "4️⃣ Ứng dụng sáng tạo của AI",
    icon: "🌈",
    color: "from-rose-500 to-orange-400",
    content: (
      <>
        <p>
          AI được ứng dụng như một <strong>công cụ tư duy sáng tạo</strong>{" "}
          giúp:
        </p>
        <ul className="list-disc pl-6 mt-2">
          <li>🧮 Phân tích mô hình tư bản tài chính theo lý luận Lênin.</li>
          <li>🏗️ Mô phỏng chính sách bảo vệ lợi ích quốc gia.</li>
          <li>💬 Sinh hội thoại giữa các chủ thể kinh tế.</li>
          <li>📊 Tự động tạo báo cáo & biểu đồ quyền lực tài chính.</li>
        </ul>
      </>
    ),
  },
  {
    id: 5,
    title: "5️⃣ Tầm nhìn & thông điệp cuối",
    icon: "🌍",
    color: "from-blue-700 to-cyan-600",
    content: (
      <>
        <p>
          Kết hợp giữa <strong>AI học thuật (ChatGPT + GroqAI)</strong> và{" "}
          <strong>tư duy Mác-Lênin</strong> để đổi mới cách tiếp cận kinh tế học
          – nơi lý luận, công nghệ và sáng tạo gặp nhau nhằm định hình{" "}
          <strong>tư duy độc lập, khách quan và nhân văn</strong>.
        </p>
      </>
    ),
  },
];

export const AIUsagePage: React.FC<AIUsagePageProps> = ({ onClose }) => {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const handleBack = () => {
    if (onClose) onClose();
    else window.history.back();
  };

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes particle {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0.2; }
          50% { opacity: 0.4; }
          100% { transform: translate(100vw, 100vh) rotate(360deg); opacity: 0; }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.5s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce 2s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientMove 5s ease infinite;
        }

        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .icon-hover {
          transition: transform 0.3s ease;
        }

        .card-hover:hover .icon-hover {
          transform: scale(1.2) rotate(10deg);
        }

        .btn-back:hover .arrow-icon {
          transform: translateX(-5px);
        }

        .arrow-icon {
          transition: transform 0.3s ease;
          display: inline-block;
          animation: bounce 1.5s ease-in-out infinite;
        }

        .expand-indicator {
          transition: transform 0.3s ease, color 0.3s ease;
        }

        .expand-indicator.expanded {
          transform: rotate(180deg);
        }

        .content-expand {
          overflow: hidden;
          transition: max-height 0.4s ease-in-out, opacity 0.4s ease-in-out;
        }

        .content-expand.collapsed {
          max-height: 0;
          opacity: 0;
        }

        .content-expand.expanded {
          max-height: 1000px;
          opacity: 1;
        }

        .border-glow {
          position: relative;
        }

        .border-glow::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 24px;
          padding: 2px;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6, #3b82f6);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .border-glow:hover::before {
          opacity: 1;
        }
      `}</style>

      <div
        className="min-h-screen bg-white text-black overflow-x-hidden"
        style={{ background: "#ffffff", color: "#000000" }}
      >
        {/* Particle Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `particle ${
                  Math.random() * 20 + 15
                }s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        {/* Nút quay lại */}
        <div className="fixed top-6 left-6 z-50 animate-slideInLeft">
          <button
            onClick={handleBack}
            className="btn-back group px-6 py-3 bg-white text-blue-600 rounded-xl shadow-lg hover:shadow-2xl transition-all border-2 border-blue-100 hover:border-blue-300 font-medium hover:scale-105 active:scale-95"
          >
            <span className="inline-flex items-center gap-2">
              <span className="arrow-icon">⬅️</span>
              Quay lại
            </span>
          </button>
        </div>

        {/* Header */}
        <header className="text-center py-16 px-4 animate-fadeInUp">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-black">
            AI Usage & Academic Integrity
          </h1>
          <p
            className="max-w-3xl mx-auto leading-relaxed text-lg px-4 animate-fadeIn text-black font-medium"
            style={{ animationDelay: "0.3s" }}
          >
            Trang minh bạch sử dụng AI trong dự án mô phỏng "Tư bản tài chính và
            quyền lực mềm của độc quyền" — minh chứng cho việc kết hợp công nghệ
            và học thuật trong nghiên cứu sáng tạo.
          </p>
        </header>

        {/* Sections: Đã chuyển sang bố cục lưới 2 cột */}
        <main className="max-w-6xl mx-auto px-4 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {" "}
            {sections.map((sec, i) => {
              const isExpanded = expanded === sec.id;
              const isHovered = hoveredCard === sec.id;

              // Thẻ số 5 (Tầm nhìn) sẽ chiếm 2 cột trên màn hình lớn
              const cardClass = sec.id === 5 ? "md:col-span-2" : "";

              return (
                <div
                  key={sec.id}
                  className={`animate-fadeInUp ${cardClass} flex`} /* Thêm flex để thẻ cùng hàng có chiều cao bằng nhau */
                  style={{ animationDelay: `${i * 0.1}s` }}
                  onMouseEnter={() => setHoveredCard(sec.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => setExpanded(isExpanded ? null : sec.id)}
                >
                  <div
                    className={`card-hover border-glow relative flex-1 rounded-3xl p-8 md:p-10 bg-white shadow-xl cursor-pointer border-2 ${
                      isHovered ? "border-blue-600" : "border-gray-300"
                    }`}
                    style={{
                      zIndex: 1,
                      background: "#fff",
                      boxShadow: "0 4px 32px 0 rgba(0,0,0,0.08)",
                    }}
                  >
                    {/* Gradient background on hover */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${sec.color} rounded-3xl pointer-events-none transition-opacity duration-300`}
                      style={{
                        opacity: isHovered ? 0.1 : 0.04,
                        zIndex: 0,
                      }}
                    />

                    {/* Tiêu đề */}
                    <div className="relative flex items-center gap-4 z-10">
                      <div className="text-5xl icon-hover drop-shadow-md text-gray-900">
                        {sec.icon}
                      </div>
                      <h2
                        className={`text-2xl md:text-3xl font-bold transition-colors duration-300 ${
                          isHovered ? "text-blue-900" : "text-gray-900"
                        }`}
                        style={{
                          textShadow: "none",
                          color: isHovered ? "#0b3b7a" : "#111827",
                        }}
                      >
                        {sec.title}
                      </h2>
                    </div>

                    {/* Nội dung mở rộng */}
                    <div
                      className={`content-expand ${
                        isExpanded ? "expanded" : "collapsed"
                      }`}
                    >
                      <div
                        className="mt-6 pl-2 text-base leading-relaxed text-gray-900 font-medium"
                        style={{ textShadow: "none", color: "#111827" }}
                      >
                        {sec.content}
                      </div>
                    </div>

                    {/* Expand indicator */}
                    <div className="relative flex items-center gap-2 mt-4 text-sm font-medium z-10">
                      <span
                        className={`expand-indicator ${
                          isExpanded ? "expanded" : ""
                        } ${
                          isHovered
                            ? "text-blue-800 animate-bounce-slow"
                            : "text-gray-700"
                        }`}
                      >
                        ▼
                      </span>
                      <span
                        className={
                          isHovered ? "text-blue-800" : "text-gray-700"
                        }
                      >
                        {isExpanded ? "Thu gọn" : "Nhấp để xem chi tiết"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        {/* Footer */}
        <footer className="relative bg-gray-100 text-gray-900 py-10 text-center overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
          <p className="text-sm opacity-90 relative z-10">
            © 2025 — Dự án "Bản đồ Quyền lực Tài chính" • Developed by{" "}
            <span className="font-semibold text-black">Nhóm 5</span>
          </p>
        </footer>
      </div>
    </>
  );
};
