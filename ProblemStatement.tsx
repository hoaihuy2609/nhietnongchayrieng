
import React from 'react';

const ProblemStatement: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
      <h3 className="text-lg font-bold text-slate-800 mb-3 border-l-4 border-amber-400 pl-3">
        Đề bài Thí nghiệm
      </h3>
      <div className="text-slate-600 text-sm leading-relaxed space-y-4">
        <p>
          "Một học sinh tiến hành thí nghiệm xác định nhiệt nóng chảy riêng của nước đá với một nhiệt lượng kế có dây nung công suất <strong>24 W</strong> cùng với cân và cốc hứng nước. Tiến hành như sau:
        </p>
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
          <p className="mb-2">
            <strong>Giai đoạn 1:</strong> Cho lượng nước đá đang tan vào nhiệt lượng kế. Dùng cốc hứng nước chảy ra từ nhiệt lượng kế trong thời gian <strong>t = 6 phút</strong> thì thu được khối lượng nước trong cốc là <strong>m = 4 g</strong>.
          </p>
          <p>
            <strong>Giai đoạn 2:</strong> Bật biến áp nguồn để dây nung nóng lượng đá cũng trong thời gian <strong>t = 6 phút</strong>. Sau đó học sinh ghi nhận tổng lượng nước trong cốc là <strong>M = 34 g</strong>."
          </p>
        </div>
        <p className="font-semibold italic text-slate-500">
          * Nhiệm vụ: Sử dụng các chức năng mô phỏng để thực hiện lại các bước trên và kiểm chứng kết quả.
        </p>
      </div>
    </div>
  );
};

export default ProblemStatement;
