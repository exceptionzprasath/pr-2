<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the Jussflow ribbon in a client-mounted Three.js component and drive its camera from document scroll progress, because WebGL cannot render during server-side rendering.
- Keep cinematic opening state local to the home page and provide a skip and replay control, because the opening must never trap navigation.
