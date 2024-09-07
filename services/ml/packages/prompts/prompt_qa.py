from langchain.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_template("""Вы являетесь помощником в выполнении поиска ответов на вопросы по нормативной документации по строительству объектов. 
                                          Используйте приведенные ниже фрагменты извлеченного контекста, чтобы ответить на вопрос.
                                          Если вы не знаете ответа, просто скажите, что вы не знаете.
        Question: {question} 
        Context: {context} 
        Answer:""")