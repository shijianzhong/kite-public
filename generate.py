from jinja2 import Environment, FileSystemLoader

def render_template(template_file, output_file, context, base_path=""):
    env = Environment(loader=FileSystemLoader("."))
    template = env.get_template(template_file)
    context["base_path"] = base_path
    rendered_content = template.render(context)

    with open(output_file, "w", encoding="utf-8") as f:
        f.write(rendered_content)

if __name__ == "__main__":
    render_template(
        "kite.html", 
        "index.html", 
        {
            "static_path": "https://kite.kagi.com/static",
            "timestamp": ""
        }, 
        "https://kite.kagi.com/"
    )
