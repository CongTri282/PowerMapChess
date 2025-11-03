import { Button } from '../components/ui/button';
import '../styles/TheoryPage.css';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardContent } from '../components/ui/card';

export function TheoryPage() {
  const [activeSection, setActiveSection] = useState<'I' | 'II' | 'III'>('I');
  const [showAnimation, setShowAnimation] = useState(false);

  return (
    <div className="theory-page">
      <div className="theory-container">
        {/* Sidebar */}
        <aside className="theory-sidebar">
          <div className="theory-sidebar-card">
            <h3 className="sidebar-title">
              Tư bản tài chính và quyền lực mềm của độc quyền – bài học cho kinh tế Việt Nam
            </h3>
            <nav className="sidebar-nav">
              <button
                className={`sidebar-btn ${activeSection === 'I' ? 'active' : ''}`}
                onClick={() => setActiveSection('I')}
              >
                Phần I: Cạnh tranh & Độc quyền
              </button>
              <button
                className={`sidebar-btn ${activeSection === 'II' ? 'active' : ''}`}
                onClick={() => setActiveSection('II')}
              >
                Lý luận Lênin (Trọng tâm)
              </button>
              <button
                className={`sidebar-btn ${activeSection === 'III' ? 'active' : ''}`}
                onClick={() => setActiveSection('III')}
              >
                Phần III: Biểu hiện mới & Vai trò lịch sử
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="theory-content">
          <AnimatePresence mode="wait">
            {activeSection === 'I' && (
              <motion.div
                key="I"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <h1 className="text-3xl font-bold font-headline mb-4">Phần I: Cạnh tranh & Độc quyền</h1>
                    <p className="text-lg mb-4">
                      Trong nền kinh tế tư bản chủ nghĩa, cạnh tranh và độc quyền là hai mặt không tách rời của cùng một quá trình.
                    </p>
                    <h2 className="text-2xl font-bold font-headline mt-6 mb-4">Sơ đồ phát triển</h2>
                    <div className="border rounded-lg p-6 bg-muted/50 my-4">
                      <div className="text-center space-y-4">
                        <div className="p-4 bg-primary/10 rounded-lg">
                          <p className='font-bold font-headline text-xl'>Cạnh tranh tự do</p>
                          <p className='text-sm text-muted-foreground'>Đây là giai đoạn ban đầu của chủ nghĩa tư bản.</p></div>
                        <div className="text-2xl">↓</div>
                        <div className="p-4 bg-primary/10 rounded-lg">
                          <p className='font-bold font-headline text-xl'>Tích tụ & Tập trung</p>
                          <p className='text-sm text-muted-foreground'>Bản thân sự cạnh tranh cùng với sự phát triển của lực lượng sản xuất  dẫn đến việc các doanh nghiệp lớn "thắng" và các doanh nghiệp nhỏ "thua", các doanh nghiệp lớn tích lũy tư bản để mở rộng quy mô. Đây được gọi là quá trình tích tụ và tập trung sản xuất.</p></div>
                        <div className="text-2xl">↓</div>
                        <div className="p-4 rounded-lg bg-destructive/10">
                          <p className='font-bold font-headline text-xl'>Độc quyền</p> <p className='text-sm text-muted-foreground'>
                            Khi sự tích tụ và tập trung này đạt đến một mức độ đủ cao, nó tất yếu dẫn đến sự ra đời của độc quyền. Các tổ chức độc quyền này là liên minh giữa các doanh nghiệp lớn nhằm thâu tóm thị trường và định giá cả. Đặc điểm đầu tiên mà V.I. Lenin chỉ ra về độc quyền chính là "Các tổ chức độc quyền có quy mô tích tụ và tập trung tư bản lớn"</p></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeSection === 'II' && (
              <motion.div
                key="II"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <h1 className="text-3xl font-bold font-headline mb-4">Phần II: Vận dụng Lý luận Lênin về Tư bản Tài chính và Sự kết hợp Tư bản trong Toàn cầu hóa</h1>
                    <p className="text-lg mb-6">
                      Theo lý luận của V.I. Lenin, tư bản tài chính là một trong năm đặc điểm kinh tế cơ bản của độc quyền. Sự hình thành của nó chính là lời lý giải cho sự kết hợp giữa tư bản công nghiệp, thương nghiệp và ngân hàng, và sự bành trướng của nó chính là động lực của toàn cầu hóa.
                    </p>

                    {/* Sự hình thành Tư bản Tài chính */}
                    <div className="space-y-4 mb-8">
                      <div className="border-l-4 border-primary pl-4 py-4">
                        <h2 className="text-2xl font-bold font-headline mb-4">1. Sự hình thành Tư bản Tài chính</h2>

                        <div className="space-y-3 mb-4">
                          <p className="text-base leading-relaxed">
                            <strong>Ban đầu:</strong> Các ngân hàng nhỏ lẻ không đủ tiềm lực để đáp ứng nhu cầu vốn cho các doanh nghiệp công nghiệp lớn.
                          </p>
                          <p className="text-base leading-relaxed">
                            <strong>Quá trình cạnh tranh:</strong> Dẫn đến các ngân hàng nhỏ bị phá sản hoặc thôn tính, hình thành nên các ngân hàng độc quyền khổng lồ với "quyền lực vạn năng".
                          </p>
                          <p className="text-base leading-relaxed">
                            <strong>Sự ra đời của Tư bản tài chính:</strong> Thông qua sự xâm nhập, kết hợp lẫn nhau giữa tư bản ngân hàng và tư bản công nghiệp qua "chế độ tham dự".
                          </p>
                        </div>

                        <div className="bg-muted/50 rounded-lg p-4 my-4">
                          <h3 className="font-bold text-lg mb-2">Cơ chế kết hợp (Chế độ tham dự):</h3>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>Mua cổ phần chi phối và cử đại diện chi phối vào bộ máy quản lý của nhau</li>
                            <li>Các ngân hàng mua cổ phần của doanh nghiệp công nghiệp và ngược lại</li>
                            <li>Hình thành một nhóm các "tài phiệt, đầu sỏ tài chính" chi phối cả hai lĩnh vực: sản xuất (công nghiệp, thương nghiệp) và tài chính (ngân hàng)</li>
                          </ul>
                        </div>
                      </div>

                      {/* Tư bản Tài chính và Toàn cầu hóa */}
                      <div className="border-l-4 border-primary pl-4 py-4">
                        <h2 className="text-2xl font-bold font-headline mb-4">2. Tư bản Tài chính và Toàn cầu hóa</h2>

                        <div className="space-y-3 mb-4">
                          <p className="text-base leading-relaxed">
                            <strong>Xuất khẩu tư bản:</strong> Đặc điểm tiếp theo của độc quyền, phát sinh từ sức mạnh của tư bản tài chính, là xuất khẩu tư bản trở thành phổ biến.
                          </p>
                          <div className="bg-primary/10 rounded-lg p-4 my-3">
                            <p className="text-base leading-relaxed font-semibold">
                              Xuất khẩu tư bản được định nghĩa là xuất khẩu giá trị ra nước ngoài nhằm thu lợi nhuận thặng dư ở nơi có lợi nhất. Đây chính là bản chất của toàn cầu hóa kinh tế trong kỷ nguyên độc quyền.
                            </p>
                          </div>
                          <p className="text-base leading-relaxed">
                            <strong>Cạnh tranh và thỏa hiệp:</strong> Khi việc xuất khẩu tư bản và cạnh tranh quốc tế trở nên gay gắt, các tập đoàn độc quyền có xu hướng thỏa hiệp, hình thành các "cartel, syndicate, trust quốc tế" để phân chia thị trường và lãnh thổ ảnh hưởng.
                          </p>
                        </div>

                        <div className="bg-destructive/10 rounded-lg p-4 my-3">
                          <p className="text-base leading-relaxed font-semibold">
                            Theo tài liệu, "toàn cầu hóa" là hệ quả tất yếu của sự phát triển của tư bản tài chính, khi nó vượt ra khỏi biên giới quốc gia thông qua xuất khẩu tư bản để tìm kiếm lợi nhuận độc quyền cao.
                          </p>
                        </div>
                      </div>

                      {/* Các hình thức Tư bản Tài chính */}
                      <div className="border-l-4 border-primary pl-4 py-4">
                        <h2 className="text-2xl font-bold font-headline mb-4">3. Các hình thức Tư bản Tài chính và sự chi phối</h2>

                        <div className="grid md:grid-cols-2 gap-4 my-4">
                          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
                            <h3 className="font-bold text-lg mb-2">Đầu tư gián tiếp (FII)</h3>
                            <p className="text-sm mb-2">Hình thức xuất khẩu tư bản thông qua việc mua chứng khoán, cổ phần:</p>
                            <ul className="list-disc pl-5 text-sm space-y-1">
                              <li>Dragon Capital</li>
                              <li>Lumen Vietnam Fund</li>
                            </ul>
                          </div>
                          <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4">
                            <h3 className="font-bold text-lg mb-2">Đầu tư trực tiếp (FDI)</h3>
                            <p className="text-sm mb-2">Hình thức xây dựng nhà máy, xí nghiệp ở nước ngoài:</p>
                            <ul className="list-disc pl-5 text-sm space-y-1">
                              <li>Samsung</li>
                              <li>Pepsi</li>
                              <li>Coca-Cola</li>
                            </ul>
                          </div>
                        </div>

                        <div className="bg-muted/50 rounded-lg p-4 my-4">
                          <p className="text-base leading-relaxed">
                            <strong>Mục đích:</strong> Thu lợi nhuận độc quyền cao. Nguồn gốc của lợi nhuận này, theo tài liệu, một phần đến từ "LĐ thặng dư và đôi khi là LĐ tất yếu của người SX nhỏ, NDLĐ các nước tư bản, thuộc địa, phụ thuộc". Điều này ngụ ý rằng các nền kinh tế (được mô tả là "phụ thuộc") là đối tượng bị chi phối để khai thác lợi nhuận.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Animation */}
                    <div className="border rounded-lg p-8 bg-gray-50 my-8">
                      <h2 className="text-2xl font-bold font-headline mb-6 text-center">Mô phỏng: Sự dung hợp Tư bản Tài chính</h2>

                      <AnimatePresence mode="wait">
                        {!showAnimation ? (
                          <motion.div
                            key="phase1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-6"
                          >
                            {/* Phase 1: Simple layout */}
                            <div className="flex items-center justify-center gap-6 py-8">
                              {/* TB Ngân hàng */}
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="p-6 bg-blue-500 text-white rounded-xl text-center w-64"
                              >
                                <h3 className="font-bold text-lg mb-1">TB Ngân hàng</h3>
                                <p className="text-sm">Nguồn vốn khổng lồ</p>
                              </motion.div>

                              {/* Dấu + */}
                              <motion.span
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="text-4xl font-bold"
                              >
                                +
                              </motion.span>

                              {/* TB Công nghiệp */}
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="p-6 bg-green-500 text-white rounded-xl text-center w-64"
                              >
                                <h3 className="font-bold text-lg mb-1">TB Công nghiệp</h3>
                                <p className="text-sm">Sức sản xuất mạnh</p>
                              </motion.div>
                            </div>

                            {/* Button */}
                            <div className="text-center">
                              <Button onClick={() => setShowAnimation(true)}>
                                Xem sự dung hợp
                              </Button>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="phase2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-6"
                          >
                            {/* Phase 2: Complex layout with center component */}
                            <div className="flex items-center justify-center gap-8 py-8">
                              {/* TB Ngân hàng (left) */}
                              <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="p-6 bg-blue-400 text-white rounded-xl text-center w-56 h-40 flex flex-col justify-center"
                              >
                                <h3 className="font-bold text-base mb-1">TB Ngân hàng</h3>
                                <p className="text-xs">Nguồn vốn khổng lồ</p>
                              </motion.div>

                              {/* TƯ BẢN TÀI CHÍNH (center) */}
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.4, type: "spring" }}
                                className="p-8 bg-purple-600 text-white rounded-xl text-center w-64 h-40 flex flex-col justify-center border-4 border-purple-700"
                              >
                                <h3 className="font-bold text-2xl mb-2">TƯ BẢN TÀI CHÍNH</h3>
                                <p className="text-sm">Khối lực lượng khổng lồ</p>
                              </motion.div>

                              {/* TB Công nghiệp (right) */}
                              <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="p-6 bg-green-400 text-white rounded-xl text-center w-56 h-40 flex flex-col justify-center"
                              >
                                <h3 className="font-bold text-base mb-1">TB Công nghiệp</h3>
                                <p className="text-xs">Sức sản xuất mạnh</p>
                              </motion.div>
                            </div>

                            {/* Results */}
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.8 }}
                              className="space-y-4"
                            >
                              <p className="font-semibold text-center text-base">Sau khi dung hợp, Tư bản Tài chính thông qua "chế độ tham dự" tạo ra:</p>
                              <div className="flex flex-wrap justify-center gap-3">
                                {['Xuất khẩu tư bản', 'Đầu tư FDI', 'Đầu tư FII', 'Cartel/Syndicate quốc tế'].map((item, index) => (
                                  <motion.div
                                    key={item}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1 + index * 0.1 }}
                                    className="px-4 py-2 bg-blue-100 text-blue-900 rounded-lg text-sm font-medium"
                                  >
                                    {item}
                                  </motion.div>
                                ))}
                              </div>
                              <p className="text-sm text-gray-600 text-center italic">
                                Dẫn đến toàn cầu hóa kinh tế và hình thành các "tài phiệt, đầu sỏ tài chính"
                              </p>
                            </motion.div>

                            {/* Button */}
                            <div className="text-center">
                              <Button onClick={() => setShowAnimation(false)}>
                                Xem lại
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeSection === 'III' && (
              <motion.div
                key="III"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <h1 className="text-3xl font-bold font-headline mb-4">Phần III: Sự chi phối của các hình thức Tư bản Tài chính hiện đại và ứng xử của Việt Nam</h1>
                    <p className="text-lg mb-6">
                      Trong khi lý luận của Lênin tập trung vào sự hợp nhất của tư bản ngân hàng và công nghiệp, thì trong kỷ nguyên toàn cầu hóa, tư bản tài chính đã biểu hiện qua nhiều hình thức mới, đặc biệt là các quỹ đầu tư, thị trường chứng khoán và gần đây nhất là công nghệ tài chính (Fintech).
                    </p>

                    {/* Tác động và sự chi phối của Tư bản Tài chính hiện đại */}
                    <div className="space-y-6 mb-8">
                      <div className="border-l-4 border-primary pl-4 py-4">
                        <h2 className="text-2xl font-bold font-headline mb-4">Tác động và sự chi phối của Tư bản Tài chính hiện đại</h2>

                        <div className="space-y-4 mb-4">
                          <div className="bg-primary/10 rounded-lg p-4">
                            <h3 className="font-bold text-lg mb-3">Sự bùng nổ của Fintech</h3>
                            <p className="text-base leading-relaxed mb-3">
                              Fintech đang định hình lại toàn bộ ngành tài chính:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-base">
                              <li><strong>Cạnh tranh trực tiếp:</strong> Các công ty Fintech cạnh tranh gay gắt với ngân hàng thương mại truyền thống, đặc biệt là trong mảng cho vay cá nhân và dịch vụ thanh toán.</li>
                              <li><strong>Tăng cường tiếp cận:</strong> Fintech giúp tăng cường khả năng tiếp cận dịch vụ tài chính cho những người dân mà trước đây ngân hàng truyền thống "bỏ quên".</li>
                              <li><strong>Đa dạng hóa:</strong> Các hình thức như ví điện tử, ngân hàng số, "Mua trước trả sau" (BNPL), và cho vay P2P (ngang hàng) đang phát triển rất nhanh, được thúc đẩy bởi tỷ lệ dùng internet và thương mại điện tử cao tại Việt Nam.</li>
                            </ul>
                          </div>

                          <div className="bg-destructive/10 rounded-lg p-4">
                            <h3 className="font-bold text-lg mb-3">Rủi ro và Thách thức (Sự "chi phối" tiêu cực):</h3>
                            <ul className="list-disc pl-6 space-y-2 text-base">
                              <li><strong>Rủi ro an ninh mạng:</strong> Đây là thách thức hàng đầu. Các hoạt động Fintech có nguy cơ bị tấn công mạng, đánh cắp dữ liệu. Thống kê cho thấy tình trạng lộ lọt dữ liệu cá nhân ở Việt Nam đang ở mức "báo động".</li>
                              <li><strong>Tội phạm tài chính công nghệ cao:</strong> Sự bùng nổ của Fintech cũng tạo ra "mảnh đất màu mỡ" cho lừa đảo tài chính. Các mô hình như ứng dụng cho vay nặng lãi, sàn giao dịch Forex/tiền ảo tự phát (mô hình Ponzi) đã khiến người dân thiệt hại "hàng nghìn tỷ đồng" trong năm 2024.</li>
                              <li><strong>Sự phụ thuộc về công nghệ và dòng vốn:</strong> Dù thúc đẩy kinh tế số, sự phát triển của Fintech cũng đi kèm với việc các dòng vốn đầu tư mạo hiểm nước ngoài và các nền tảng công nghệ toàn cầu thâm nhập sâu hơn vào thị trường nội địa.</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Cách Việt Nam ứng xử */}
                      <div className="border-l-4 border-primary pl-4 py-4">
                        <h2 className="text-2xl font-bold font-headline mb-4">Cách Việt Nam ứng xử và bảo vệ lợi ích quốc gia</h2>

                        <p className="text-base leading-relaxed mb-4">
                          Trước dòng chảy tư bản tài chính mới, chính sách của Việt Nam thể hiện sự chủ động hội nhập nhưng có kiểm soát, nhằm "giữ vững ổn định chính trị - xã hội" và bảo vệ lợi ích quốc gia.
                        </p>

                        <div className="space-y-4 mb-4">
                          <div className="bg-muted/50 rounded-lg p-4">
                            <h3 className="font-bold text-lg mb-3">Khung chính sách vĩ mô:</h3>
                            <ul className="list-disc pl-6 space-y-2 text-base">
                              <li>Đảng và Nhà nước đã ban hành các nghị quyết cốt lõi về hội nhập quốc tế, như <strong>Nghị quyết 22-NQ/TW</strong> và <strong>Nghị quyết 06-NQ/TW</strong>.</li>
                              <li>Các nghị quyết này nhấn mạnh việc hội nhập kinh tế hiệu quả, đặc biệt là khi tham gia các Hiệp định Thương mại Tự do (FTA) thế hệ mới, đồng thời phải đảm bảo an ninh và ổn định.</li>
                              <li>Một <strong>Ban Chỉ đạo quốc gia về hội nhập quốc tế</strong> do Thủ tướng đứng đầu đã được thành lập để điều phối thống nhất.</li>
                            </ul>
                          </div>

                          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
                            <h3 className="font-bold text-lg mb-3">Ứng xử cụ thể với Fintech và rủi ro:</h3>
                            <ul className="list-disc pl-6 space-y-2 text-base">
                              <li><strong>Xây dựng khung pháp lý:</strong> Việt Nam nhận diện khung pháp lý cho Fintech (bắt đầu từ Nghị định 101/2012 về thanh toán không dùng tiền mặt) là chưa hoàn chỉnh. Do đó, ưu tiên hàng đầu là xây dựng một khung pháp lý đầy đủ, bao gồm cả cơ chế thử nghiệm có kiểm soát (Sandbox) cho các dịch vụ mới.</li>
                              <li><strong>Quản trị rủi ro:</strong> Trọng tâm chính sách là "quản trị rủi ro" và "đảm bảo an toàn tài chính", đặc biệt là an ninh mạng và bảo vệ dữ liệu cá nhân.</li>
                              <li><strong>Khuyến khích hợp tác:</strong> Thay vì để Fintech và ngân hàng truyền thống "triệt tiêu" nhau, chính sách của Việt Nam khuyến khích sự hợp tác giữa hai bên để khai thác thế mạnh của nhau.</li>
                              <li><strong>Chủ động thu hút vốn:</strong> Việt Nam đang có kế hoạch xây dựng <strong>Trung tâm tài chính quốc tế</strong>. Đây là một bước đi chủ động để kết nối với mạng lưới tài chính toàn cầu, định vị Việt Nam trở thành một điểm thu hút, quản lý và vận hành các dòng tư bản tài chính, thay vì chỉ bị động tiếp nhận.</li>
                            </ul>
                          </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4 mt-4">
                          <p className="text-base leading-relaxed font-semibold">
                            Tóm lại, Việt Nam không ngăn cản mà đang tìm cách "nắn dòng" và "kiểm soát" các hình thức tư bản tài chính hiện đại. Chiến lược là vừa mở cửa hội nhập để tận dụng vốn và công nghệ, vừa nhanh chóng xây dựng hàng rào pháp lý và hạ tầng kỹ thuật số để quản lý rủi ro, chống tội phạm công nghệ cao và bảo vệ sự ổn định của nền kinh tế.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
