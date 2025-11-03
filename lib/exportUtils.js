// Export utilities for courses

// Export course as PDF using browser's print functionality
export const exportToPDF = (courseData) => {
  const printWindow = window.open('', '_blank');
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${courseData.title}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        h1 {
          color: #2563eb;
          border-bottom: 3px solid #2563eb;
          padding-bottom: 10px;
        }
        h2 {
          color: #7c3aed;
          margin-top: 30px;
        }
        h3 {
          color: #059669;
          margin-top: 20px;
        }
        .course-info {
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .module {
          margin: 20px 0;
          padding: 15px;
          border-left: 4px solid #7c3aed;
          background: #faf5ff;
        }
        .quiz-section {
          background: #f0fdf4;
          padding: 15px;
          border-radius: 8px;
          margin: 15px 0;
        }
        .question {
          margin: 10px 0;
          font-weight: 600;
        }
        .options {
          margin: 5px 0 10px 20px;
        }
        .option {
          margin: 3px 0;
        }
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <h1>${courseData.title}</h1>
      
      <div class="course-info">
        <p><strong>Description:</strong> ${courseData.description || 'No description available'}</p>
        <p><strong>Difficulty:</strong> ${courseData.difficulty || 'Not specified'}</p>
        <p><strong>Duration:</strong> ${courseData.duration || 'Not specified'}</p>
        <p><strong>Created:</strong> ${new Date(courseData.createdAt).toLocaleDateString()}</p>
      </div>

      ${courseData.structuredContent?.overview ? `
        <h2>Course Overview</h2>
        <div>${courseData.structuredContent.overview.replace(/\n/g, '<br>')}</div>
      ` : ''}

      ${courseData.structuredContent?.learningObjectives ? `
        <h2>Learning Objectives</h2>
        <div>${courseData.structuredContent.learningObjectives.replace(/\n/g, '<br>')}</div>
      ` : ''}

      ${courseData.structuredContent?.prerequisites ? `
        <h2>Prerequisites</h2>
        <div>${courseData.structuredContent.prerequisites.replace(/\n/g, '<br>')}</div>
      ` : ''}

      ${courseData.structuredContent?.modules?.length > 0 ? `
        <h2>Course Modules</h2>
        ${courseData.structuredContent.modules.map((module, index) => `
          <div class="module">
            <h3>Module ${index + 1}: ${module.title}</h3>
            <p>${module.content}</p>
          </div>
        `).join('')}
      ` : ''}

      ${courseData.quizzes?.length > 0 ? `
        <h2>Quiz Questions</h2>
        ${courseData.quizzes.map((quiz, quizIndex) => `
          <div class="quiz-section">
            <h3>${quiz.moduleTitle} - Quiz</h3>
            ${quiz.questions.map((question, qIndex) => `
              <div>
                <div class="question">${qIndex + 1}. ${question.question}</div>
                <div class="options">
                  ${question.options.map((option, oIndex) => `
                    <div class="option">${String.fromCharCode(65 + oIndex)}. ${option}</div>
                  `).join('')}
                </div>
                <p><strong>Answer:</strong> ${String.fromCharCode(65 + question.correct)}. ${question.options[question.correct]}</p>
                <p><em>${question.explanation}</em></p>
              </div>
            `).join('')}
          </div>
        `).join('')}
      ` : ''}

      ${courseData.structuredContent?.assessment ? `
        <h2>Assessment Methods</h2>
        <div>${courseData.structuredContent.assessment.replace(/\n/g, '<br>')}</div>
      ` : ''}

      ${courseData.structuredContent?.resources ? `
        <h2>Learning Resources</h2>
        <div>${courseData.structuredContent.resources.replace(/\n/g, '<br>')}</div>
      ` : ''}

      <div class="no-print" style="margin-top: 40px; text-align: center;">
        <button onclick="window.print()" style="background: #2563eb; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
          Print / Save as PDF
        </button>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.focus();
  
  // Auto-trigger print dialog
  setTimeout(() => {
    printWindow.print();
  }, 500);
};

// Export course as Markdown
export const exportToMarkdown = (courseData) => {
  let markdown = `# ${courseData.title}\n\n`;
  
  markdown += `**Description:** ${courseData.description || 'No description available'}\n`;
  markdown += `**Difficulty:** ${courseData.difficulty || 'Not specified'}\n`;
  markdown += `**Duration:** ${courseData.duration || 'Not specified'}\n`;
  markdown += `**Created:** ${new Date(courseData.createdAt).toLocaleDateString()}\n\n`;
  
  if (courseData.structuredContent?.overview) {
    markdown += `## Course Overview\n\n${courseData.structuredContent.overview}\n\n`;
  }
  
  if (courseData.structuredContent?.learningObjectives) {
    markdown += `## Learning Objectives\n\n${courseData.structuredContent.learningObjectives}\n\n`;
  }
  
  if (courseData.structuredContent?.prerequisites) {
    markdown += `## Prerequisites\n\n${courseData.structuredContent.prerequisites}\n\n`;
  }
  
  if (courseData.structuredContent?.modules?.length > 0) {
    markdown += `## Course Modules\n\n`;
    courseData.structuredContent.modules.forEach((module, index) => {
      markdown += `### Module ${index + 1}: ${module.title}\n\n`;
      markdown += `${module.content}\n\n`;
    });
  }
  
  if (courseData.quizzes?.length > 0) {
    markdown += `## Quiz Questions\n\n`;
    courseData.quizzes.forEach((quiz, quizIndex) => {
      markdown += `### ${quiz.moduleTitle} - Quiz\n\n`;
      quiz.questions.forEach((question, qIndex) => {
        markdown += `**${qIndex + 1}. ${question.question}**\n\n`;
        question.options.forEach((option, oIndex) => {
          markdown += `${String.fromCharCode(65 + oIndex)}. ${option}\n`;
        });
        markdown += `\n**Answer:** ${String.fromCharCode(65 + question.correct)}. ${question.options[question.correct]}\n`;
        markdown += `*${question.explanation}*\n\n`;
      });
    });
  }
  
  if (courseData.structuredContent?.assessment) {
    markdown += `## Assessment Methods\n\n${courseData.structuredContent.assessment}\n\n`;
  }
  
  if (courseData.structuredContent?.resources) {
    markdown += `## Learning Resources\n\n${courseData.structuredContent.resources}\n\n`;
  }
  
  // Download the markdown file
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${courseData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Export course as JSON
export const exportToJSON = (courseData) => {
  const jsonData = {
    title: courseData.title,
    description: courseData.description,
    difficulty: courseData.difficulty,
    duration: courseData.duration,
    createdAt: courseData.createdAt,
    structuredContent: courseData.structuredContent,
    quizzes: courseData.quizzes,
    modules: courseData.structuredContent?.modules || [],
    metadata: {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      format: 'MindCourse JSON'
    }
  };
  
  const jsonString = JSON.stringify(jsonData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${courseData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};







