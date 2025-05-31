import gradio as gr
import requests

DJANGO_BASE = "http://localhost:8000"

def get_interview():
    try:
        res = requests.post(f"{DJANGO_BASE}/questions/")
        return res.json().get("questions", "Error: No questions returned")
    except Exception as e:
        return f"Error: {str(e)}"

def get_leetcode():
    try:
        res = requests.post(f"{DJANGO_BASE}/leetcodeQs/")
        return res.json().get("questions", "Error: No questions returned")
    except Exception as e:
        return f"Error: {str(e)}"

with gr.Blocks() as interviewerDemo:
    gr.Markdown("# AI Interview Generator")

    with gr.Row():
        interview_output = gr.Textbox(label="Interview Questions", lines=15)
        leetcode_output = gr.Textbox(label="Leetcode Suggestions", lines=10)

    with gr.Row():
        interview_button = gr.Button("Generate Interview Questions")
        leetcode_button = gr.Button("Generate Leetcode Questions")

    interview_button.click(fn=get_interview, outputs=interview_output)
    leetcode_button.click(fn=get_leetcode, outputs=leetcode_output)

interviewerDemo.launch()
