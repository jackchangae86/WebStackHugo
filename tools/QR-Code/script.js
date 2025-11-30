// 移除了语言切换相关代码，只保留中文功能

// 二维码生成器类
class QRCodeGenerator {
    constructor() {
        this.qrcode = null;
        this.init();
    }

    // 初始化
    init() {
        this.setupColorSync();
        this.generateQRCode();
        this.setupEventListeners();

    }

    // 设置颜色选择器和输入框同步 - 边框功能移除后，此方法不再需要
    setupColorSync() {
        // 边框功能已移除，无需颜色同步
    }



    // 设置事件监听器
    setupEventListeners() {
        // 内容输入变化
        document.getElementById('content').addEventListener('input', () => {
            this.generateQRCode();
        });

        // 文字编辑变化
        const textSettings = ['qrText', 'fontFamily', 'fontSize', 'fontWeight', 'fontColor'];
        textSettings.forEach(id => {
            document.getElementById(id).addEventListener('input', () => {
                this.generateQRCode();
            });
            document.getElementById(id).addEventListener('change', () => {
                this.generateQRCode();
            });
        });

        // 基本设置变化
        const basicSettings = ['size', 'margin', 'correctLevel', 'dotScale'];
        basicSettings.forEach(id => {
            document.getElementById(id).addEventListener('input', () => {
                this.generateQRCode();
            });
            document.getElementById(id).addEventListener('change', () => {
                this.generateQRCode();
            });
        });

        // 边框样式功能已移除，无需事件监听器

        // 下载按钮
        document.getElementById('downloadPNG').addEventListener('click', () => {
            this.downloadPNG();
        });

        document.getElementById('downloadSVG').addEventListener('click', () => {
            this.downloadSVG();
        });
        
        // 窗口大小变化事件监听
        window.addEventListener('resize', () => {
            this.adjustQRCodePreviewSize();
        });
    }

    // 生成二维码
    generateQRCode() {
        // 获取参数
        const content = document.getElementById('content').value;
        const size = parseInt(document.getElementById('size').value);
        const margin = parseInt(document.getElementById('margin').value);
        const correctLevel = document.getElementById('correctLevel').value;
        const dotScale = parseFloat(document.getElementById('dotScale').value);
        
        // 获取文字设置
        const qrText = document.getElementById('qrText').value;
        const fontFamily = document.getElementById('fontFamily').value;
        const fontSize = parseInt(document.getElementById('fontSize').value);
        const fontWeight = document.getElementById('fontWeight').value;
        const fontColor = document.getElementById('fontColor').value;

        // 清除旧的二维码
        const qrcodeElement = document.getElementById('qrcode');
        qrcodeElement.innerHTML = '';

        // 创建新的二维码
        this.qrcode = new QRCode(qrcodeElement, {
            text: content,
            width: size,
            height: size,
            margin: margin,
            colorDark: '#000000', // 默认黑色前景
            colorLight: '#ffffff', // 默认白色背景
            correctLevel: QRCode.CorrectLevel[correctLevel],
            dotScale: dotScale
        });

        // 更新文字预览
        this.updateTextPreview(qrText, fontFamily, fontSize, fontWeight, fontColor);
        
        // 调整二维码预览大小，适配移动端
        this.adjustQRCodePreviewSize();
    }
    
    // 更新文字预览
    updateTextPreview(text, fontFamily, fontSize, fontWeight, fontColor) {
        const textPreview = document.getElementById('textPreview');
        textPreview.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;
        
        const pElement = textPreview.querySelector('p');
        pElement.style.fontFamily = fontFamily;
        pElement.style.fontSize = `${fontSize}px`;
        pElement.style.fontWeight = fontWeight;
        pElement.style.color = fontColor;
    }
    
    // 调整二维码预览大小，适配移动端
    adjustQRCodePreviewSize() {
        const qrContainer = document.getElementById('qrcode');
        const qrImg = qrContainer.querySelector('img');
        
        if (!qrImg) return;
        
        // 获取窗口宽度
        const windowWidth = window.innerWidth;
        
        // 如果是移动端
        if (windowWidth <= 768) {
            // 计算容器宽度
            const previewContainer = document.getElementById('previewContainer');
            const containerWidth = previewContainer.clientWidth;
            
            // 设置二维码最大宽度，确保不超过容器宽度，并留有一些边距
            const maxWidth = containerWidth - 32; // 减去32px的padding
            qrImg.style.maxWidth = `${maxWidth}px`;
            qrImg.style.height = 'auto';
        } else {
            // 桌面端恢复原始大小
            qrImg.style.maxWidth = 'none';
            qrImg.style.height = 'auto';
        }
    }

    // 应用边框样式 - 现在使用CSS默认样式
    applyBorderStyle() {
        // 使用CSS默认样式，无需动态设置
    }

    // 下载PNG
    downloadPNG() {
        const qrcodeImg = document.querySelector('#qrcode img');
        if (!qrcodeImg) {
            alert('请先生成二维码');
            return;
        }

        // 获取文字设置
        const qrText = document.getElementById('qrText').value;
        const fontFamily = document.getElementById('fontFamily').value;
        const fontSize = parseInt(document.getElementById('fontSize').value);
        const fontWeight = document.getElementById('fontWeight').value;
        const fontColor = document.getElementById('fontColor').value;
        
        // 创建一个canvas元素，用于绘制二维码和边框
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // 获取二维码图片尺寸
        const imgWidth = qrcodeImg.width;
        const imgHeight = qrcodeImg.height;
        
        // 默认边框样式
        const borderWidth = 4;
        const borderRadius = 12;
        const padding = 16;
        const borderColor = '#000000';
        const bgColor = '#ffffff';
        const spacing = 20; // 文字与二维码之间的间距
        
        // 先设置字体样式，以便正确测量文字宽度
        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        
        // 文字区域设置
        const textPadding = 20;
        const lineHeight = fontSize * 1.5;
        const lines = qrText.split('\n');
        const textHeight = lines.length * lineHeight;
        const textWidth = Math.max(...lines.map(line => ctx.measureText(line).width)) + textPadding * 2;
        
        // 计算带边框的总尺寸（垂直布局：文字在上，二维码在下）
        const maxContentWidth = Math.max(textWidth, imgWidth);
        const totalWidth = maxContentWidth + padding * 2 + borderWidth * 2;
        const totalHeight = textHeight + imgHeight + spacing + padding * 2 + borderWidth * 2;
        
        // 设置canvas尺寸
        canvas.width = totalWidth;
        canvas.height = totalHeight;
        
        // 重新设置字体样式（因为canvas尺寸改变后，上下文状态会重置）
        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        
        // 绘制背景
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, totalWidth, totalHeight);
        
        // 绘制边框
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = borderWidth;
        ctx.roundRect(borderWidth / 2, borderWidth / 2, totalWidth - borderWidth, totalHeight - borderWidth, borderRadius);
        ctx.stroke();
        
        // 绘制文字（居中显示）
        ctx.fillStyle = fontColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const textStartY = borderWidth + padding + textHeight / 2;
        const textCenterX = totalWidth / 2;
        lines.forEach((line, index) => {
            const y = textStartY - textHeight / 2 + lineHeight / 2 + index * lineHeight;
            ctx.fillText(line, textCenterX, y);
        });
        
        // 绘制分隔线（水平）
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(borderWidth + padding, borderWidth + padding + textHeight + spacing / 2);
        ctx.lineTo(totalWidth - borderWidth - padding, borderWidth + padding + textHeight + spacing / 2);
        ctx.stroke();
        
        // 绘制二维码图片（居中显示）
        const qrStartX = (totalWidth - imgWidth) / 2;
        const qrStartY = borderWidth + padding + textHeight + spacing;
        ctx.drawImage(qrcodeImg, qrStartX, qrStartY, imgWidth, imgHeight);
        
        // 将canvas转换为PNG并下载
        const link = document.createElement('a');
        link.download = `qrcode-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    // 下载SVG
    downloadSVG() {
        const qrcodeImg = document.querySelector('#qrcode img');
        if (!qrcodeImg) {
            alert('请先生成二维码');
            return;
        }

        // 获取文字设置
        const qrText = document.getElementById('qrText').value;
        const fontSize = parseInt(document.getElementById('fontSize').value);
        const fontColor = document.getElementById('fontColor').value;
        
        // 获取二维码图片尺寸
        const imgWidth = qrcodeImg.width;
        const imgHeight = qrcodeImg.height;
        
        // 默认边框样式
        const borderWidth = 4;
        const borderRadius = 12;
        const padding = 16;
        const borderColor = '#000000';
        const bgColor = '#ffffff';
        const spacing = 20; // 文字与二维码之间的间距
        
        // 文字区域设置
        const textPadding = 20;
        const lineHeight = fontSize * 1.5;
        const lines = qrText.split('\n');
        const textHeight = lines.length * lineHeight;
        
        // 估算文字宽度（SVG中无法直接测量，这里使用经验值）
        const avgCharWidth = fontSize * 0.5;
        const textWidth = Math.max(...lines.map(line => line.length * avgCharWidth)) + textPadding * 2;
        
        // 计算带边框的总尺寸（垂直布局：文字在上，二维码在下）
        const maxContentWidth = Math.max(textWidth, imgWidth);
        const totalWidth = maxContentWidth + padding * 2 + borderWidth * 2;
        const totalHeight = textHeight + imgHeight + spacing + padding * 2 + borderWidth * 2;
        
        // 获取字体设置
        const fontFamily = document.getElementById('fontFamily').value;
        const fontWeight = document.getElementById('fontWeight').value;
        
        // 生成文字SVG元素（居中显示）
        const textElements = lines.map((line, index) => {
            const textCenterX = totalWidth / 2;
            const y = borderWidth + padding + textHeight / 2 - textHeight / 2 + lineHeight / 2 + index * lineHeight;
            return `<text x="${textCenterX}" y="${y}" font-size="${fontSize}" font-weight="${fontWeight}" fill="${fontColor}" text-anchor="middle" dominant-baseline="middle" font-family="${fontFamily}">${line}</text>`;
        }).join('\n            ');
        
        // 创建SVG内容
        const svgContent = `
            <svg width="${totalWidth}" height="${totalHeight}" xmlns="http://www.w3.org/2000/svg">
                <!-- 背景 -->
                <rect width="${totalWidth}" height="${totalHeight}" fill="${bgColor}" rx="${borderRadius}" ry="${borderRadius}" />
                <!-- 边框 -->
                <rect x="${borderWidth / 2}" y="${borderWidth / 2}" width="${totalWidth - borderWidth}" height="${totalHeight - borderWidth}" fill="none" stroke="${borderColor}" stroke-width="${borderWidth}" rx="${borderRadius}" ry="${borderRadius}" />
                <!-- 文字 -->
                ${textElements}
                <!-- 分隔线（水平） -->
                <line x1="${borderWidth + padding}" y1="${borderWidth + padding + textHeight + spacing / 2}" x2="${totalWidth - borderWidth - padding}" y2="${borderWidth + padding + textHeight + spacing / 2}" stroke="#e2e8f0" stroke-width="2" />
                <!-- 二维码图片（居中显示） -->
                <image x="${(totalWidth - imgWidth) / 2}" y="${borderWidth + padding + textHeight + spacing}" width="${imgWidth}" height="${imgHeight}" href="${qrcodeImg.src}" />
            </svg>
        `;
        
        // 创建下载链接
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const link = document.createElement('a');
        link.download = `qrcode-${Date.now()}.svg`;
        link.href = URL.createObjectURL(blob);
        link.click();
        
        // 释放URL对象
        URL.revokeObjectURL(link.href);
    }
}

// 初始化二维码生成器
document.addEventListener('DOMContentLoaded', () => {
    window.qrCodeGenerator = new QRCodeGenerator();
});